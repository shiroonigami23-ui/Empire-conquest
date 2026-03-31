using System.Collections.Generic;
using System.Linq;
using EmpireConquest.Core;
using EmpireConquest.UnityRuntime;
using UnityEngine;

namespace EmpireConquest.Runtime
{
    public class EmpireGameRuntime : MonoBehaviour
    {
        public GameState State { get; private set; } = new();

        private ResourceService _resources = null!;
        private BuildingService _buildings = null!;
        private UnitService _units = null!;
        private HeroService _heroes = null!;
        private ResearchService _research = null!;
        private CombatService _combat = null!;
        private ProgressionService _progression = null!;
        private StoreService _store = null!;
        private SocialService _social = null!;
        private EngagementService _engagement = null!;

        private List<BuildingDefinition> _buildingDefs = null!;
        private List<UnitDefinition> _unitDefs = null!;
        private List<HeroDefinition> _heroDefs = null!;
        private List<PetDefinition> _petDefs = null!;
        private List<TechnologyDefinition> _techDefs = null!;
        private List<AchievementDefinition> _achievementDefs = null!;
        private List<ChallengeDefinition> _challengeDefs = null!;
        private List<EventDefinition> _eventDefs = null!;

        private void Awake()
        {
            SeedInitialState();
            SeedDefinitions();

            _resources = new ResourceService(State);
            _buildings = new BuildingService(State, _resources, _buildingDefs);
            _units = new UnitService(State, _resources, _unitDefs);
            _heroes = new HeroService(State, _resources, _heroDefs, _petDefs);
            _research = new ResearchService(State, _resources, _techDefs);
            _combat = new CombatService(_units, _heroes);
            _progression = new ProgressionService(State, _resources, _achievementDefs, _challengeDefs, _eventDefs);
            _store = new StoreService(State, _resources);
            _social = new SocialService(State);
            _engagement = new EngagementService(State, _resources, _units, _combat);

            _resources.RecalculateProduction(_buildingDefs);
            Debug.Log("EmpireGameRuntime initialized with expanded systems.");
        }

        private void Update()
        {
            _resources.TickSeconds(Time.deltaTime);
            _buildings.Tick(Time.deltaTime);
            _research.Tick(Time.deltaTime);
            _heroes.Tick(Time.deltaTime);
            _engagement.Tick(Time.deltaTime);
            _resources.RecalculateProduction(_buildingDefs);
        }

        public bool Build(string buildingId, int slot)
        {
            var result = _buildings.Construct(buildingId, slot);
            if (result)
            {
                _resources.RecalculateProduction(_buildingDefs);
            }
            return result;
        }

        public bool Upgrade(string buildingId, int slot)
        {
            var result = _buildings.Upgrade(buildingId, slot);
            if (result)
            {
                _resources.RecalculateProduction(_buildingDefs);
            }
            return result;
        }
        public bool CancelUpgrade() => _buildings.CancelActiveUpgrade();
        public bool ExpandLand() => _buildings.ExpandLand();
        public bool UpgradeTownHall() => _buildings.UpgradeTownHall();

        public bool Train(string unitId, int count) => _units.Train(unitId, count);
        public bool SetDefensiveTroops(string unitId, int count) => _units.AssignDefensiveTroops(unitId, count);
        public bool Heal(string unitId, int count) => _units.HealInHospital(unitId, count);
        public bool RecruitHero(string heroId) => _heroes.Recruit(heroId);
        public bool UpgradeHero(string heroId) => _heroes.UpgradeHero(heroId);
        public bool AssignPet(string heroId, string petId) => _heroes.AssignPet(heroId, petId);
        public bool UseAbility(string heroId, string abilityId) => _heroes.ActivateAbility(heroId, abilityId);
        public bool StartResearch(string techId) => _research.StartResearch(techId);
        public bool Battle(int enemyPower) => _combat.ResolveBattle(enemyPower);
        public bool CompleteChallenge(string id) => _progression.CompleteChallenge(id);
        public bool CompleteEvent(string id) => _progression.CompleteEvent(id);
        public bool ClaimAchievement(string id) => _progression.TryClaimAchievement(id);
        public bool BuyBuilder() => _store.BuyBuilder();
        public bool UpgradeBuilder() => _store.UpgradeBuilder();
        public bool BuyGuildItem(string id) => _store.BuyGuildShopItem(id);
        public bool BuyDecoration(string id, string name, Dictionary<ResourceType, int> cost) => _store.BuyDecoration(id, name, cost);
        public bool OpenChest(string chestId) => _engagement.OpenChest(chestId);
        public void ClaimGift() => _engagement.ClaimRandomGift();
        public bool DonateClanTroops(string unitId, int count) => _engagement.DonateTroops(unitId, count);
        public bool DonateClanTokens(int amount) => _engagement.DonateTokens(amount);
        public bool DefendTrollRaid() => _engagement.DefendOpeningTrollRaid();
        public bool AttackEnemyBase(string baseId) => _engagement.AttackEnemyBase(baseId);
        public string ScoutEnemyBase(string baseId) => _engagement.ScoutBase(baseId);
        public void StartClanWar() => _engagement.StartClanWar();
        public bool ClanWarBattle(int enemyPower) => _engagement.FightClanWarBattle(enemyPower);
        public IReadOnlyList<PlayerBaseProfile> SearchPlayers(string query) => _engagement.SearchPlayers(query);
        public bool AttackPlayerBase(string playerId, out string status) => _engagement.AttackPlayerBase(playerId, out status);
        public bool DefendHomeBase(int enemyPower) => _engagement.DefendHomeBase(enemyPower);
        public void UpdateProfile(string motto, string themeId) => _social.UpdateProfile(motto, themeId);
        public string VisitBase(string owner) => _social.VisitBase(owner);
        public IReadOnlyList<LeaderboardEntry> GetLeaderboard() => _social.GetLeaderboard();
        public IEnumerable<BuildingDefinition> GetBuildingDefinitions() => _buildingDefs;
        public IEnumerable<UnitDefinition> GetUnitDefinitions() => _unitDefs;
        public IEnumerable<HeroDefinition> GetHeroDefinitions() => _heroDefs;

        private void SeedInitialState()
        {
            State.Resources = new Dictionary<ResourceType, double>
            {
                [ResourceType.Gold] = 4000,
                [ResourceType.Food] = 2200,
                [ResourceType.Wood] = 1800,
                [ResourceType.Stone] = 1300,
                [ResourceType.Iron] = 900,
                [ResourceType.Gems] = 650,
                [ResourceType.Mana] = 400,
                [ResourceType.Honor] = 0,
                [ResourceType.GuildCoins] = 0,
                [ResourceType.ClanTokens] = 0,
                [ResourceType.EventTokens] = 0,
                [ResourceType.Coal] = 450,
                [ResourceType.Plank] = 120,
                [ResourceType.Brick] = 120
            };

            State.Buildings.Add(new BuildingInstance { Id = "town_hall", Level = 1, SlotIndex = 0 });
            State.Buildings.Add(new BuildingInstance { Id = "residence", Level = 1, SlotIndex = 1 });
            State.Profile = new ProfileState
            {
                Tag = "#SHIRO23",
                Motto = "Empire first, always.",
                AvatarId = "avatar_emperor",
                BannerId = "banner_tiger",
                ThemeId = "theme_obsidian"
            };

            State.GuildShop = new List<GuildShopItem>
            {
                new() { Id = "guild_food_pack", Name = "Guild Food Pack", GuildTokenCost = 20, Reward = C(ResourceType.Food, 500) },
                new() { Id = "guild_speed_boost", Name = "Guild Speed Booster", GuildTokenCost = 35, Reward = C(ResourceType.Gems, 10) },
                new() { Id = "guild_dark_essence", Name = "Dark Essence", GuildTokenCost = 45, Reward = C(ResourceType.Mana, 350, ResourceType.Coal, 120) }
            };

            State.EnemyBases = new List<EnemyBaseDefinition>
            {
                new() { Id = "troll_camp_alpha", Name = "Troll Camp Alpha", Map = "Whispering Hills", Power = 950, Reward = C(ResourceType.Gold, 550, ResourceType.EventTokens, 12) },
                new() { Id = "troll_fort_beta", Name = "Troll Fort Beta", Map = "Ashen Ridge", Power = 1300, Reward = C(ResourceType.Gold, 900, ResourceType.GuildCoins, 14, ResourceType.ClanTokens, 10) }
            };

            State.PlayerPool = new List<PlayerBaseProfile>
            {
                new() { Id = "bot_001", Name = "RogueMiner", EstimatedPower = 780, IsOnline = false, DefensiveTroops = new Dictionary<string, int> { ["swordsman"] = 8, ["archer"] = 5 } },
                new() { Id = "bot_002", Name = "IronWarden", EstimatedPower = 1220, IsOnline = false, DefensiveTroops = new Dictionary<string, int> { ["armored_soldier"] = 6, ["archer"] = 6 } },
                new() { Id = "bot_003", Name = "LiveEagle", EstimatedPower = 1600, IsOnline = true, DefensiveTroops = new Dictionary<string, int> { ["cavalry"] = 5, ["catapult"] = 2 } },
                new() { Id = "bot_004", Name = "NightScout", EstimatedPower = 930, IsOnline = false, DefensiveTroops = new Dictionary<string, int> { ["mercenary_scout"] = 9, ["swordsman"] = 4 } }
            };
        }

        private void SeedDefinitions()
        {
            _buildingDefs = new List<BuildingDefinition>
            {
                new() { Id = "town_hall", Name = "Town Hall", MaxLevel = 20, PowerPerLevel = 35, IsStorage = true, UpgradeSeconds = 28f,
                    StorageBonus = C(ResourceType.Gold, 800, ResourceType.Food, 800, ResourceType.Wood, 800, ResourceType.Stone, 800, ResourceType.Iron, 500, ResourceType.Mana, 300) },
                new() { Id = "residence", Name = "Residence House", MaxLevel = 20, PowerPerLevel = 14, UpgradeSeconds = 9f,
                    BaseCost = C(ResourceType.Gold, 150, ResourceType.Wood, 100), HourlyProduction = C(ResourceType.Food, 30) },
                new() { Id = "gold_mine", Name = "Gold Mine", MaxLevel = 20, PowerPerLevel = 12,
                    BaseCost = C(ResourceType.Gold, 100, ResourceType.Wood, 90, ResourceType.Stone, 60), HourlyProduction = C(ResourceType.Gold, 70) },
                new() { Id = "gem_mine", Name = "Gem Mine", MaxLevel = 15, PowerPerLevel = 18, RequiredTownHallLevel = 4, UpgradeSeconds = 14f,
                    BaseCost = C(ResourceType.Gold, 700, ResourceType.Stone, 420, ResourceType.Iron, 150), HourlyProduction = C(ResourceType.Gems, 4) },
                new() { Id = "rock_mining", Name = "Rock Mining", MaxLevel = 20, PowerPerLevel = 10,
                    BaseCost = C(ResourceType.Gold, 120, ResourceType.Wood, 80), HourlyProduction = C(ResourceType.Stone, 55) },
                new() { Id = "coal_mining", Name = "Coal Mining", MaxLevel = 20, PowerPerLevel = 12,
                    BaseCost = C(ResourceType.Gold, 180, ResourceType.Wood, 110), HourlyProduction = C(ResourceType.Coal, 40) },
                new() { Id = "iron_mining", Name = "Iron Mining", MaxLevel = 20, PowerPerLevel = 13,
                    BaseCost = C(ResourceType.Gold, 220, ResourceType.Stone, 120), HourlyProduction = C(ResourceType.Iron, 45) },
                new() { Id = "wood_cutting", Name = "Wood Cutting", MaxLevel = 20, PowerPerLevel = 10,
                    BaseCost = C(ResourceType.Gold, 90, ResourceType.Stone, 40), HourlyProduction = C(ResourceType.Wood, 80) },
                new() { Id = "plank_maker", Name = "Plank Maker", MaxLevel = 15, PowerPerLevel = 14,
                    BaseCost = C(ResourceType.Gold, 260, ResourceType.Wood, 180), HourlyProduction = C(ResourceType.Plank, 24) },
                new() { Id = "brick_factory", Name = "Brick Factory", MaxLevel = 15, PowerPerLevel = 14,
                    BaseCost = C(ResourceType.Gold, 260, ResourceType.Stone, 180), HourlyProduction = C(ResourceType.Brick, 24) },
                new() { Id = "crafting_hall", Name = "Crafting Hall", MaxLevel = 15, PowerPerLevel = 16,
                    BaseCost = C(ResourceType.Gold, 300, ResourceType.Plank, 80, ResourceType.Brick, 80), HourlyProduction = C(ResourceType.Honor, 4) },
                new() { Id = "laboratory", Name = "Laboratory", MaxLevel = 15, PowerPerLevel = 20, RequiredTownHallLevel = 3, UpgradeSeconds = 18f,
                    BaseCost = C(ResourceType.Gold, 350, ResourceType.Wood, 180, ResourceType.Stone, 220, ResourceType.Iron, 100),
                    HourlyProduction = C(ResourceType.Mana, 40) },
                new() { Id = "spell_factory", Name = "Spell Factory", MaxLevel = 15, PowerPerLevel = 24, RequiredTownHallLevel = 4, UpgradeSeconds = 19f,
                    BaseCost = C(ResourceType.Gold, 420, ResourceType.Mana, 120, ResourceType.Coal, 90), HourlyProduction = C(ResourceType.EventTokens, 3) },
                new() { Id = "hospital", Name = "Hospital", MaxLevel = 15, PowerPerLevel = 18, RequiredTownHallLevel = 3, UpgradeSeconds = 16f,
                    BaseCost = C(ResourceType.Gold, 320, ResourceType.Wood, 160, ResourceType.Mana, 80), HourlyProduction = C() },
                new() { Id = "army_camp", Name = "Army Camp", MaxLevel = 15, PowerPerLevel = 18,
                    BaseCost = C(ResourceType.Gold, 250, ResourceType.Wood, 220, ResourceType.Stone, 130), HourlyProduction = C() },
                new() { Id = "dark_camp", Name = "Dark Army Camp", MaxLevel = 15, PowerPerLevel = 24, RequiredTownHallLevel = 5, UpgradeSeconds = 18f,
                    BaseCost = C(ResourceType.Gold, 420, ResourceType.Mana, 160, ResourceType.Coal, 120), HourlyProduction = C() },
                new() { Id = "barrack", Name = "Barrack", MaxLevel = 15, PowerPerLevel = 18,
                    BaseCost = C(ResourceType.Gold, 300, ResourceType.Wood, 260, ResourceType.Stone, 180, ResourceType.Iron, 80), HourlyProduction = C() },
                new() { Id = "wall", Name = "Wall", MaxLevel = 20, PowerPerLevel = 8, IsWall = true,
                    BaseCost = C(ResourceType.Gold, 90, ResourceType.Stone, 140, ResourceType.Brick, 24), HourlyProduction = C() },
                new() { Id = "archer_tower", Name = "Archer Tower", MaxLevel = 15, PowerPerLevel = 22, RequiredTownHallLevel = 3, UpgradeSeconds = 16f,
                    BaseCost = C(ResourceType.Gold, 300, ResourceType.Wood, 220, ResourceType.Plank, 70), HourlyProduction = C() },
                new() { Id = "cannon", Name = "Cannon", MaxLevel = 15, PowerPerLevel = 24,
                    BaseCost = C(ResourceType.Gold, 320, ResourceType.Iron, 160, ResourceType.Coal, 120), HourlyProduction = C() },
                new() { Id = "mortar", Name = "Mortar", MaxLevel = 15, PowerPerLevel = 26,
                    BaseCost = C(ResourceType.Gold, 360, ResourceType.Iron, 180, ResourceType.Brick, 70), HourlyProduction = C() },
                new() { Id = "eagle_artillery", Name = "Eagle Artillery", MaxLevel = 10, PowerPerLevel = 38,
                    BaseCost = C(ResourceType.Gold, 900, ResourceType.Iron, 400, ResourceType.Mana, 240), HourlyProduction = C() },
                new() { Id = "air_rocket_defense", Name = "Air Rocket Defense", MaxLevel = 12, PowerPerLevel = 30, RequiredTownHallLevel = 5, UpgradeSeconds = 21f,
                    BaseCost = C(ResourceType.Gold, 700, ResourceType.Iron, 280, ResourceType.Coal, 190), HourlyProduction = C() },
                new() { Id = "treasury", Name = "Treasury", MaxLevel = 15, PowerPerLevel = 12, IsStorage = true, RequiredTownHallLevel = 2, UpgradeSeconds = 14f,
                    BaseCost = C(ResourceType.Gold, 260, ResourceType.Stone, 200), HourlyProduction = C(),
                    StorageBonus = C(ResourceType.Gold, 1200, ResourceType.Wood, 600, ResourceType.Stone, 600, ResourceType.Iron, 450, ResourceType.Coal, 350) },
                new() { Id = "clan_hall", Name = "Clan Hall", MaxLevel = 12, PowerPerLevel = 15, IsStorage = true, RequiredTownHallLevel = 3, UpgradeSeconds = 15f,
                    BaseCost = C(ResourceType.Gold, 300, ResourceType.Wood, 220, ResourceType.Stone, 180), HourlyProduction = C(ResourceType.ClanTokens, 2),
                    StorageBonus = C(ResourceType.Food, 650, ResourceType.Mana, 400, ResourceType.Brick, 250, ResourceType.Plank, 250) }
            };

            _unitDefs = new List<UnitDefinition>
            {
                U("swordsman", "Swordsman", "Infantry", false, 120, 18, 13, 5, C(ResourceType.Gold, 55, ResourceType.Food, 25)),
                U("archer", "Archer", "Ranged", false, 80, 24, 7, 6, C(ResourceType.Gold, 60, ResourceType.Food, 20, ResourceType.Wood, 20)),
                U("cavalry", "Cavalry", "Mounted", false, 150, 30, 16, 10, C(ResourceType.Gold, 100, ResourceType.Food, 35, ResourceType.Iron, 15)),
                U("catapult", "Catapult", "Siege", false, 190, 46, 9, 4, C(ResourceType.Gold, 220, ResourceType.Wood, 120, ResourceType.Iron, 40)),
                U("siege_ram", "Siege Ram", "Siege", false, 240, 42, 24, 3, C(ResourceType.Gold, 260, ResourceType.Wood, 160, ResourceType.Iron, 55)),
                U("mercenary_scout", "Mercenary Scout", "Scout", false, 95, 15, 8, 12, C(ResourceType.Gold, 90, ResourceType.Food, 20, ResourceType.Gems, 2)),
                U("armored_soldier", "Armored Soldier", "Tank", false, 260, 38, 32, 4, C(ResourceType.Gold, 280, ResourceType.Iron, 120, ResourceType.Brick, 35)),
                U("witch", "Witch", "DarkCaster", true, 105, 48, 10, 5, C(ResourceType.Gold, 180, ResourceType.Mana, 65, ResourceType.Coal, 40)),
                U("golem", "Golem", "DarkTank", true, 420, 34, 40, 3, C(ResourceType.Gold, 240, ResourceType.Mana, 90, ResourceType.Stone, 110)),
                U("skeleton", "Skeleton", "DarkSwarm", true, 70, 16, 5, 6, C(ResourceType.Gold, 70, ResourceType.Mana, 20))
            };

            _petDefs = new List<PetDefinition>
            {
                new() { Id = "dragon_pet", Name = "Emberwing", Type = "Dragon", IntroLine = "The sky kneels when Emberwing roars.", HeroAttackBonus = 0.22f, HeroDefenseBonus = 0.08f },
                new() { Id = "bear_pet", Name = "Stonepaw", Type = "Bear", IntroLine = "Stonepaw guards the line without fear.", HeroAttackBonus = 0.10f, HeroDefenseBonus = 0.24f }
            };

            _heroDefs = new List<HeroDefinition>
            {
                new()
                {
                    Id = "warlord_ash", Name = "Warlord Ash", HeroClass = "Commander", IntroLine = "Lead with fire, win with steel.",
                    Cost = C(ResourceType.Gold, 1200, ResourceType.Honor, 80), BaseHp = 560, BaseAttack = 88, BaseDefense = 64, BaseLeadership = 70,
                    AllowedPetIds = new List<string> { "dragon_pet", "bear_pet" },
                    Abilities = new List<HeroAbility>
                    {
                        new() { Id = "warcry", Name = "War Cry", Description = "Boost ally attack for 8s.", CooldownSeconds = 25, AttackMultiplier = 1.35f, DefenseMultiplier = 1f },
                        new() { Id = "shield_wall", Name = "Shield Wall", Description = "Boost ally defense for 8s.", CooldownSeconds = 32, AttackMultiplier = 1f, DefenseMultiplier = 1.4f }
                    }
                },
                new()
                {
                    Id = "arca_the_witch", Name = "Arca The Witch", HeroClass = "Arcane", IntroLine = "Dark sparks, brighter victories.",
                    Cost = C(ResourceType.Gold, 1500, ResourceType.Mana, 180), BaseHp = 420, BaseAttack = 118, BaseDefense = 42, BaseLeadership = 64,
                    AllowedPetIds = new List<string> { "dragon_pet" },
                    Abilities = new List<HeroAbility>
                    {
                        new() { Id = "meteor_hex", Name = "Meteor Hex", Description = "Burst magic damage.", CooldownSeconds = 28, AttackMultiplier = 1.55f, DefenseMultiplier = 1f }
                    }
                }
            };

            _techDefs = new List<TechnologyDefinition>
            {
                new() { Id = "improved_mining", Name = "Improved Mining", ResearchSeconds = 60, BonusType = "production", BonusValue = 0.1f, RequiredTownHallLevel = 3, IsMiningResearch = true, Cost = C(ResourceType.Gold, 500, ResourceType.Stone, 300) },
                new() { Id = "advanced_weapons", Name = "Advanced Weapons", ResearchSeconds = 90, BonusType = "attack", BonusValue = 0.15f, RequiredTownHallLevel = 4, IsTroopResearch = true, Cost = C(ResourceType.Gold, 800, ResourceType.Iron, 400) },
                new() { Id = "hospital_mastery", Name = "Hospital Mastery", ResearchSeconds = 75, BonusType = "healing", BonusValue = 0.2f, RequiredTownHallLevel = 4, Cost = C(ResourceType.Gold, 600, ResourceType.Mana, 200) },
                new() { Id = "dark_alchemy", Name = "Dark Alchemy", ResearchSeconds = 110, BonusType = "dark_units", BonusValue = 0.18f, RequiredTownHallLevel = 5, IsTroopResearch = true, Cost = C(ResourceType.Gold, 900, ResourceType.Mana, 300, ResourceType.Coal, 180) }
            };

            _eventDefs = new List<EventDefinition>
            {
                new() { Id = "blood_moon", Name = "Blood Moon Siege", Description = "Defend against endless raids.", DurationSeconds = 300, Reward = C(ResourceType.EventTokens, 40, ResourceType.Gold, 600) },
                new() { Id = "royal_festival", Name = "Royal Festival", Description = "Complete civic tasks for prestige.", DurationSeconds = 180, Reward = C(ResourceType.Honor, 30, ResourceType.Gems, 15) }
            };

            _challengeDefs = new List<ChallengeDefinition>
            {
                new() { Id = "raise_army", Name = "Raise the Army", GoalType = "army_power", GoalValue = 200, Reward = C(ResourceType.Gold, 450, ResourceType.Honor, 20) },
                new() { Id = "city_growth", Name = "City Growth", GoalType = "townhall_power", GoalValue = 260, Reward = C(ResourceType.Gems, 12, ResourceType.Wood, 300) }
            };

            _achievementDefs = new List<AchievementDefinition>
            {
                new() { Id = "first_blood", Name = "First Blood", Category = AchievementCategory.Army, GoalType = "army_power", GoalValue = 100, BadgeId = "badge_blooded", Reward = C(ResourceType.Honor, 15) },
                new() { Id = "architect", Name = "Architect", Category = AchievementCategory.Economy, GoalType = "townhall_power", GoalValue = 300, BadgeId = "badge_architect", Reward = C(ResourceType.Gems, 20) },
                new() { Id = "legend_mark", Name = "Legend Mark", Category = AchievementCategory.Progression, GoalType = "heroes", GoalValue = 2, BadgeId = "badge_legend", Reward = C(ResourceType.Honor, 50) }
            };
        }

        private static Dictionary<ResourceType, int> C(params object[] values)
        {
            var dict = new Dictionary<ResourceType, int>();
            for (var i = 0; i < values.Length; i += 2)
            {
                dict[(ResourceType)values[i]] = (int)values[i + 1];
            }
            return dict;
        }

        private static UnitDefinition U(
            string id,
            string name,
            string type,
            bool dark,
            int hp,
            int atk,
            int def,
            int speed,
            Dictionary<ResourceType, int> cost)
        {
            return new UnitDefinition
            {
                Id = id,
                Name = name,
                Type = type,
                DarkUnit = dark,
                Cost = cost,
                Stats = new UnitStats { Hp = hp, Attack = atk, Defense = def, Speed = speed }
            };
        }
    }
}
