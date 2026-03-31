using System;
using System.Collections.Generic;
using System.Linq;
using EmpireConquest.Core;
using UnityEngine;

namespace EmpireConquest.UnityRuntime
{
    public static class BoostHelper
    {
        public static float M(GameState s, BoostType t) => s.ActiveBoosts.Where(b => b.Type == t && b.RemainingSeconds > 0f).Select(b => b.Multiplier).DefaultIfEmpty(1f).Max();
        public static void Tick(GameState s, float dt) { foreach (var b in s.ActiveBoosts) b.RemainingSeconds = Mathf.Max(0f, b.RemainingSeconds - dt); s.ActiveBoosts.RemoveAll(b => b.RemainingSeconds <= 0f); }
    }

    public class ResourceService
    {
        private readonly GameState _s;
        public ResourceService(GameState s) => _s = s;
        public bool HasEnough(Dictionary<ResourceType, int> c) => c.All(kv => _s.Resources.TryGetValue(kv.Key, out var v) && v >= kv.Value);
        public bool Spend(Dictionary<ResourceType, int> c) { if (!HasEnough(c)) return false; foreach (var kv in c) _s.Resources[kv.Key] -= kv.Value; return true; }
        public void Add(Dictionary<ResourceType, int> a) { foreach (var kv in a) { if (!_s.Resources.ContainsKey(kv.Key)) _s.Resources[kv.Key] = 0; _s.Resources[kv.Key] += kv.Value; Clamp(kv.Key); } }
        public void RecalculateProduction(IReadOnlyList<BuildingDefinition> defs)
        {
            _s.ProductionPerHour = Enum.GetValues(typeof(ResourceType)).Cast<ResourceType>().ToDictionary(t => t, _ => 0d);
            _s.ResourceCapacity = Enum.GetValues(typeof(ResourceType)).Cast<ResourceType>().ToDictionary(t => t, _ => 0d);
            var baseCap = 1200 + (_s.Player.TownHallLevel * 450);
            var capped = new[] { ResourceType.Gold, ResourceType.Food, ResourceType.Wood, ResourceType.Stone, ResourceType.Iron, ResourceType.Coal, ResourceType.Plank, ResourceType.Brick, ResourceType.Mana };
            foreach (var r in capped) _s.ResourceCapacity[r] = baseCap;
            foreach (var r in new[] { ResourceType.Gems, ResourceType.GuildCoins, ResourceType.ClanTokens, ResourceType.Honor, ResourceType.EventTokens }) _s.ResourceCapacity[r] = 99999;
            var mineMul = 1f + (_s.Player.MiningResearchLevel * 0.06f);
            foreach (var bi in _s.Buildings)
            {
                var d = defs.FirstOrDefault(x => x.Id == bi.Id); if (d == null) continue;
                foreach (var p in d.HourlyProduction)
                {
                    double v = p.Value * bi.Level;
                    if (p.Key is ResourceType.Gold or ResourceType.Stone or ResourceType.Wood or ResourceType.Iron or ResourceType.Coal) v *= mineMul;
                    _s.ProductionPerHour[p.Key] += v;
                }
                foreach (var sb in d.StorageBonus) _s.ResourceCapacity[sb.Key] += sb.Value * bi.Level;
            }
            foreach (var k in _s.Resources.Keys.ToList()) Clamp(k);
        }
        public void TickSeconds(float dt) { foreach (var p in _s.ProductionPerHour) { if (!_s.Resources.ContainsKey(p.Key)) _s.Resources[p.Key] = 0; _s.Resources[p.Key] += p.Value * (dt / 3600d); Clamp(p.Key); } }
        private void Clamp(ResourceType k) { if (!_s.ResourceCapacity.TryGetValue(k, out var c) || c <= 0) return; if (_s.Resources[k] > c) _s.Resources[k] = c; }
    }

    public class BuildingService
    {
        private readonly GameState _s; private readonly ResourceService _r; private readonly List<BuildingDefinition> _d;
        public BuildingService(GameState s, ResourceService r, List<BuildingDefinition> d) { _s = s; _r = r; _d = d; }
        public bool Construct(string id, int slot)
        {
            if (_s.Buildings.Any(b => b.SlotIndex == slot)) return false;
            if (slot >= 16 + (_s.Player.LandExpansionLevel * 12)) return false;
            var d = _d.FirstOrDefault(x => x.Id == id); if (d == null || _s.Player.TownHallLevel < d.RequiredTownHallLevel) return false;
            var m = BoostHelper.M(_s, BoostType.Building);
            var c = d.BaseCost.ToDictionary(kv => kv.Key, kv => Mathf.Max(1, Mathf.RoundToInt(kv.Value / m)));
            if (!_r.Spend(c)) return false;
            _s.Buildings.Add(new BuildingInstance { Id = id, SlotIndex = slot, Level = 1 }); _s.Player.TownHallPower += d.PowerPerLevel; return true;
        }
        public bool Upgrade(string id, int slot)
        {
            var bi = _s.Buildings.FirstOrDefault(b => b.Id == id && b.SlotIndex == slot); var d = _d.FirstOrDefault(x => x.Id == id);
            if (bi == null || d == null || bi.Level >= d.MaxLevel || _s.Player.TownHallLevel < d.RequiredTownHallLevel) return false;
            var m = BoostHelper.M(_s, BoostType.Building);
            var c = d.BaseCost.ToDictionary(kv => kv.Key, kv => Mathf.Max(1, Mathf.RoundToInt(Mathf.FloorToInt(kv.Value * Mathf.Pow(1.45f, bi.Level)) / m)));
            if (!_r.Spend(c)) return false;
            if (d.IsWall) { bi.Level++; _s.Player.TownHallPower += d.PowerPerLevel; return true; }
            if (_s.ActiveBuildingUpgrade.RemainingSeconds > 0f) return false;
            bi.IsUpgrading = true; _s.ActiveBuildingUpgrade = new BuildingUpgradeTask { BuildingId = id, SlotIndex = slot, RemainingSeconds = Mathf.Max(2f, d.UpgradeSeconds / m), PaidCost = c }; return true;
        }
        public void Tick(float dt)
        {
            if (_s.ActiveBuildingUpgrade.RemainingSeconds <= 0f) return;
            _s.ActiveBuildingUpgrade.RemainingSeconds -= dt; if (_s.ActiveBuildingUpgrade.RemainingSeconds > 0f) return;
            var t = _s.ActiveBuildingUpgrade; var bi = _s.Buildings.FirstOrDefault(b => b.Id == t.BuildingId && b.SlotIndex == t.SlotIndex); var d = _d.FirstOrDefault(x => x.Id == t.BuildingId);
            if (bi != null && d != null) { bi.Level++; bi.IsUpgrading = false; _s.Player.TownHallPower += d.PowerPerLevel; }
            _s.ActiveBuildingUpgrade = new BuildingUpgradeTask();
        }
        public bool CancelActiveUpgrade()
        {
            if (_s.ActiveBuildingUpgrade.RemainingSeconds <= 0f) return false;
            _r.Add(_s.ActiveBuildingUpgrade.PaidCost.ToDictionary(kv => kv.Key, kv => Mathf.RoundToInt(kv.Value * 0.8f)));
            var bi = _s.Buildings.FirstOrDefault(b => b.Id == _s.ActiveBuildingUpgrade.BuildingId && b.SlotIndex == _s.ActiveBuildingUpgrade.SlotIndex); if (bi != null) bi.IsUpgrading = false;
            _s.ActiveBuildingUpgrade = new BuildingUpgradeTask(); return true;
        }
        public bool ExpandLand()
        {
            if (_s.Player.LandExpansionLevel >= _s.Player.MaxLandExpansionLevel) return false;
            if (_s.Player.TownHallLevel < _s.Player.LandExpansionLevel + 1) return false;
            var c = new Dictionary<ResourceType, int> { [ResourceType.Gold] = 800 * _s.Player.LandExpansionLevel, [ResourceType.Wood] = 400 * _s.Player.LandExpansionLevel, [ResourceType.Stone] = 400 * _s.Player.LandExpansionLevel };
            if (!_r.Spend(c)) return false; _s.Player.LandExpansionLevel++; return true;
        }
        public bool UpgradeTownHall()
        {
            var th = _s.Buildings.FirstOrDefault(b => b.Id == "town_hall"); var d = _d.FirstOrDefault(x => x.Id == "town_hall");
            if (th == null || d == null || th.Level >= d.MaxLevel) return false;
            var c = new Dictionary<ResourceType, int> { [ResourceType.Gold] = 1200 * th.Level, [ResourceType.Stone] = 900 * th.Level, [ResourceType.Iron] = 300 * th.Level };
            if (!_r.Spend(c)) return false; th.Level++; _s.Player.TownHallLevel = th.Level; _s.Player.TownHallPower += d.PowerPerLevel * 2; return true;
        }
    }

    public class UnitService
    {
        private readonly GameState _s; private readonly ResourceService _r; private readonly List<UnitDefinition> _d;
        public UnitService(GameState s, ResourceService r, List<UnitDefinition> d) { _s = s; _r = r; _d = d; }
        public bool Train(string id, int count)
        {
            if (count <= 0) return false; var u = _d.FirstOrDefault(x => x.Id == id); if (u == null) return false;
            var m = BoostHelper.M(_s, BoostType.Training); var c = u.Cost.ToDictionary(kv => kv.Key, kv => Mathf.Max(1, Mathf.RoundToInt((kv.Value * count) / m)));
            if (!_r.Spend(c)) return false; if (!_s.Units.ContainsKey(id)) _s.Units[id] = 0; _s.Units[id] += count; return true;
        }
        public int CalculateArmyPower()
        {
            var mul = 1f + (_s.Player.TroopResearchLevel * 0.07f); var p = 0;
            foreach (var u in _d) { _s.Units.TryGetValue(u.Id, out var c); p += Mathf.RoundToInt((u.Stats.Hp + u.Stats.Attack + u.Stats.Defense) * c * mul); }
            return p;
        }
        public void RegisterCasualties(float ratio)
        {
            foreach (var u in _d)
            {
                if (!_s.Units.TryGetValue(u.Id, out var c) || c <= 0) continue;
                var inj = Mathf.Clamp(Mathf.RoundToInt(c * ratio), 0, c); _s.Units[u.Id] -= inj; if (!_s.InjuredUnits.ContainsKey(u.Id)) _s.InjuredUnits[u.Id] = 0; _s.InjuredUnits[u.Id] += inj;
            }
        }
        public bool HealInHospital(string id, int count)
        {
            if (!_s.InjuredUnits.TryGetValue(id, out var inj) || count <= 0 || inj < count) return false;
            var m = BoostHelper.M(_s, BoostType.Healing);
            var c = new Dictionary<ResourceType, int> { [ResourceType.Gold] = Mathf.Max(1, Mathf.RoundToInt((count * 5) / m)), [ResourceType.Mana] = Mathf.Max(1, Mathf.RoundToInt((count * 2) / m)) };
            if (!_r.Spend(c)) return false; _s.InjuredUnits[id] -= count; if (!_s.Units.ContainsKey(id)) _s.Units[id] = 0; _s.Units[id] += count; return true;
        }
    }

    public class HeroService
    {
        private readonly GameState _s; private readonly ResourceService _r; private readonly List<HeroDefinition> _h; private readonly List<PetDefinition> _p;
        public HeroService(GameState s, ResourceService r, List<HeroDefinition> h, List<PetDefinition> p) { _s = s; _r = r; _h = h; _p = p; }
        public bool Recruit(string id) { if (_s.Heroes.Any(x => x.Id == id)) return false; var d = _h.FirstOrDefault(x => x.Id == id); if (d == null || !_r.Spend(d.Cost)) return false; _s.Heroes.Add(new HeroInstance { Id = id, Level = 1, MaxXp = 120 }); return true; }
        public bool UpgradeHero(string id) { var hi = _s.Heroes.FirstOrDefault(x => x.Id == id); if (hi == null) return false; var c = new Dictionary<ResourceType, int> { [ResourceType.Gold] = 200 * hi.Level, [ResourceType.Mana] = 80 * hi.Level }; if (!_r.Spend(c)) return false; hi.Level++; hi.MaxXp += 50; return true; }
        public bool AssignPet(string heroId, string petId) { var hi = _s.Heroes.FirstOrDefault(x => x.Id == heroId); var hd = _h.FirstOrDefault(x => x.Id == heroId); if (hi == null || hd == null || !_p.Any(x => x.Id == petId) || !hd.AllowedPetIds.Contains(petId)) return false; _s.OwnedPets.Add(petId); hi.ActivePetId = petId; return true; }
        public bool ActivateAbility(string heroId, string aid) { var hi = _s.Heroes.FirstOrDefault(x => x.Id == heroId); var hd = _h.FirstOrDefault(x => x.Id == heroId); var ab = hd?.Abilities.FirstOrDefault(x => x.Id == aid); if (hi == null || ab == null) return false; if (hi.AbilityCooldowns.TryGetValue(aid, out var cd) && cd > 0f) return false; hi.AbilityCooldowns[aid] = ab.CooldownSeconds; return true; }
        public void Tick(float dt) { foreach (var hi in _s.Heroes) foreach (var k in hi.AbilityCooldowns.Keys.ToList()) hi.AbilityCooldowns[k] = Mathf.Max(0f, hi.AbilityCooldowns[k] - dt); }
        public int CalculateHeroPower()
        {
            var t = 0; foreach (var hi in _s.Heroes)
            {
                var d = _h.FirstOrDefault(x => x.Id == hi.Id); if (d == null) continue; var lv = hi.Level - 1; var atk = d.BaseAttack + lv * 5; var def = d.BaseDefense + lv * 3;
                if (!string.IsNullOrWhiteSpace(hi.ActivePetId)) { var p = _p.FirstOrDefault(x => x.Id == hi.ActivePetId); if (p != null) { atk = Mathf.RoundToInt(atk * (1f + p.HeroAttackBonus)); def = Mathf.RoundToInt(def * (1f + p.HeroDefenseBonus)); } }
                t += (d.BaseHp + lv * 20) + (atk * 2) + def + (d.BaseLeadership + lv * 2);
            }
            return t;
        }
    }

    public class ResearchService
    {
        private readonly GameState _s; private readonly ResourceService _r; private readonly List<TechnologyDefinition> _d; private float _remaining;
        public ResearchService(GameState s, ResourceService r, List<TechnologyDefinition> d) { _s = s; _r = r; _d = d; }
        public bool StartResearch(string id)
        {
            if (!string.IsNullOrWhiteSpace(_s.ResearchingTechnologyId) || _s.Researched.Contains(id) || !_s.Buildings.Any(b => b.Id == "laboratory")) return false;
            var t = _d.FirstOrDefault(x => x.Id == id); if (t == null || _s.Player.TownHallLevel < t.RequiredTownHallLevel || !_r.Spend(t.Cost)) return false;
            _s.ResearchingTechnologyId = id; _remaining = t.ResearchSeconds; return true;
        }
        public void Tick(float dt)
        {
            if (string.IsNullOrWhiteSpace(_s.ResearchingTechnologyId)) return;
            _remaining -= dt; if (_remaining > 0f) return;
            var t = _d.FirstOrDefault(x => x.Id == _s.ResearchingTechnologyId);
            if (t != null) { if (t.IsMiningResearch) _s.Player.MiningResearchLevel++; if (t.IsTroopResearch) _s.Player.TroopResearchLevel++; }
            _s.Researched.Add(_s.ResearchingTechnologyId); _s.ResearchingTechnologyId = "";
        }
    }

    public class ProgressionService
    {
        private readonly GameState _s; private readonly ResourceService _r; private readonly List<AchievementDefinition> _a; private readonly List<ChallengeDefinition> _c; private readonly List<EventDefinition> _e;
        public ProgressionService(GameState s, ResourceService r, List<AchievementDefinition> a, List<ChallengeDefinition> c, List<EventDefinition> e) { _s = s; _r = r; _a = a; _c = c; _e = e; }
        public bool TryClaimAchievement(string id) { var x = _a.FirstOrDefault(v => v.Id == id); if (x == null || _s.ClaimedAchievements.Contains(id) || !Goal(x.GoalType, x.GoalValue)) return false; _s.ClaimedAchievements.Add(id); _s.Badges.Add(x.BadgeId); _r.Add(x.Reward); _r.Add(new Dictionary<ResourceType, int> { [ResourceType.GuildCoins] = 10, [ResourceType.ClanTokens] = 5 }); _s.ActiveBoosts.Add(new ActiveBoost { Type = BoostType.Training, Multiplier = 1.35f, RemainingSeconds = 150f }); return true; }
        public bool CompleteChallenge(string id) { var x = _c.FirstOrDefault(v => v.Id == id); if (x == null || _s.CompletedChallenges.Contains(id) || !Goal(x.GoalType, x.GoalValue)) return false; _s.CompletedChallenges.Add(id); _r.Add(x.Reward); return true; }
        public bool CompleteEvent(string id) { var x = _e.FirstOrDefault(v => v.Id == id); if (x == null || _s.CompletedEvents.Contains(id)) return false; _s.CompletedEvents.Add(id); _r.Add(x.Reward); _r.Add(new Dictionary<ResourceType, int> { [ResourceType.GuildCoins] = 8, [ResourceType.ClanTokens] = 8 }); return true; }
        private bool Goal(string t, int v) => t switch { "townhall_power" => _s.Player.TownHallPower >= v, "heroes" => _s.Heroes.Count >= v, "army_power" => _s.Units.Values.Sum() >= v, "badges" => _s.Badges.Count >= v, _ => false };
    }

    public class SocialService
    {
        private readonly GameState _s; public SocialService(GameState s) { _s = s; if (_s.Leaderboard.Count == 0) _s.Leaderboard.AddRange(new[] { new LeaderboardEntry { PlayerName = "StormRuler", Power = 5400, Rank = 1 }, new LeaderboardEntry { PlayerName = "CrimsonKing", Power = 4920, Rank = 2 }, new LeaderboardEntry { PlayerName = "NightFalcon", Power = 4600, Rank = 3 } }); }
        public void UpdateProfile(string m, string t) { _s.Profile.Motto = m; _s.Profile.ThemeId = t; }
        public string VisitBase(string n) => $"Visited {n}'s base. Collected scouting insights and layout data.";
        public IReadOnlyList<LeaderboardEntry> GetLeaderboard() => _s.Leaderboard.OrderBy(x => x.Rank).ToList();
    }

    public class StoreService
    {
        private readonly GameState _s; private readonly ResourceService _r; public StoreService(GameState s, ResourceService r) { _s = s; _r = r; }
        public bool BuyDecoration(string id, string name, Dictionary<ResourceType, int> c) { if (!_r.Spend(c)) return false; _s.OwnedDecorations.Add(new StoreDecoration { Id = id, Name = name, Cost = c }); return true; }
        public bool BuyBuilder() { if (!_r.Spend(new Dictionary<ResourceType, int> { [ResourceType.Gems] = 250 })) return false; _s.Player.BuildersOwned++; return true; }
        public bool UpgradeBuilder() { if (!_r.Spend(new Dictionary<ResourceType, int> { [ResourceType.Gems] = 130 * _s.Player.BuilderLevel })) return false; _s.Player.BuilderLevel++; return true; }
        public bool BuyGuildShopItem(string id) { var i = _s.GuildShop.FirstOrDefault(x => x.Id == id); if (i == null || !_r.Spend(new Dictionary<ResourceType, int> { [ResourceType.GuildCoins] = i.GuildTokenCost })) return false; _r.Add(i.Reward); return true; }
    }

    public class CombatService
    {
        private readonly UnitService _u; private readonly HeroService _h; public CombatService(UnitService u, HeroService h) { _u = u; _h = h; }
        public bool ResolveBattle(int enemyPower, int seed = -1)
        {
            var pp = _u.CalculateArmyPower() + _h.CalculateHeroPower(); var ratio = enemyPower <= 0 ? 2f : (float)pp / enemyPower; var win = Mathf.Clamp(ratio * 0.58f, 0.08f, 0.96f);
            if (seed >= 0) UnityEngine.Random.InitState(seed); var ok = UnityEngine.Random.value < win; _u.RegisterCasualties(ok ? 0.05f : 0.24f); return ok;
        }
    }

    public class EngagementService
    {
        private readonly GameState _s; private readonly ResourceService _r; private readonly CombatService _c;
        public EngagementService(GameState s, ResourceService r, CombatService c) { _s = s; _r = r; _c = c; }
        public void Tick(float dt) => BoostHelper.Tick(_s, dt);
        public bool OpenChest(string id) { if (_s.OpenedChests.Contains(id)) return false; _s.OpenedChests.Add(id); _r.Add(new Dictionary<ResourceType, int> { [ResourceType.Gold] = UnityEngine.Random.Range(150, 450), [ResourceType.Wood] = UnityEngine.Random.Range(120, 300), [ResourceType.GuildCoins] = UnityEngine.Random.Range(4, 14), [ResourceType.ClanTokens] = UnityEngine.Random.Range(3, 10) }); _s.ActiveBoosts.Add(new ActiveBoost { Type = (BoostType)UnityEngine.Random.Range(0, 3), Multiplier = UnityEngine.Random.Range(1.25f, 1.6f), RemainingSeconds = UnityEngine.Random.Range(120f, 260f) }); return true; }
        public void ClaimRandomGift() => _r.Add(new Dictionary<ResourceType, int> { [ResourceType.Gold] = UnityEngine.Random.Range(100, 400), [ResourceType.Food] = UnityEngine.Random.Range(80, 250), [ResourceType.Gems] = UnityEngine.Random.Range(1, 6) });
        public bool DonateTroops(string id, int n) { if (!_s.Units.TryGetValue(id, out var c) || n <= 0 || c < n) return false; _s.Units[id] -= n; _s.ClanCastleTroopDonations += n; _r.Add(new Dictionary<ResourceType, int> { [ResourceType.ClanTokens] = Mathf.Max(1, n / 2) }); return true; }
        public bool DonateTokens(int n) { if (n <= 0 || !_r.Spend(new Dictionary<ResourceType, int> { [ResourceType.ClanTokens] = n })) return false; _s.ClanCastleTokenDonations += n; _r.Add(new Dictionary<ResourceType, int> { [ResourceType.Honor] = Mathf.Max(1, n / 2) }); return true; }
        public bool DefendOpeningTrollRaid() => _c.ResolveBattle(800, 101);
        public bool AttackEnemyBase(string id) { var b = _s.EnemyBases.FirstOrDefault(x => x.Id == id); if (b == null) return false; var win = _c.ResolveBattle(b.Power); if (win) _r.Add(b.Reward); return win; }
        public string ScoutBase(string id) { var b = _s.EnemyBases.FirstOrDefault(x => x.Id == id); if (b == null) return "Unknown base."; _s.LastScoutedBaseId = id; return $"{b.Name} scouted on {b.Map}. Estimated power {b.Power}."; }
        public void StartClanWar() { _s.ClanWar.Active = true; _s.ClanWar.ClanWarPoints = 0; _s.ClanWar.EnemyClanPoints = UnityEngine.Random.Range(30, 70); }
        public bool FightClanWarBattle(int p) { if (!_s.ClanWar.Active) return false; var win = _c.ResolveBattle(p); if (win) { _s.ClanWar.ClanWarPoints += UnityEngine.Random.Range(8, 18); _r.Add(new Dictionary<ResourceType, int> { [ResourceType.GuildCoins] = 6, [ResourceType.ClanTokens] = 6 }); } else _s.ClanWar.EnemyClanPoints += UnityEngine.Random.Range(6, 16); return win; }
    }
}
