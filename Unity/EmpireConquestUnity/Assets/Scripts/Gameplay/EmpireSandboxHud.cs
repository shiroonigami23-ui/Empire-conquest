using System.Collections.Generic;
using System.Linq;
using EmpireConquest.Core;
using EmpireConquest.Runtime;
using UnityEngine;

namespace EmpireConquest.Gameplay
{
    public class EmpireSandboxHud : MonoBehaviour
    {
        [SerializeField] private EmpireGameRuntime runtime = null!;
        [SerializeField] private EmpireBuildingSandbox buildingSandbox = null!;
        [SerializeField] private BattleDirector battleDirector = null!;

        private string _message = "Empire command center ready.";
        private string _visitMessage = "";

        private void OnGUI()
        {
            if (buildingSandbox != null && runtime != null)
            {
                buildingSandbox.SetUpgradePulse(runtime.State.ActiveBuildingUpgrade.RemainingSeconds > 0f);
            }
            DrawLeftPanel();
            DrawRightPanel();
        }

        private void DrawLeftPanel()
        {
            GUI.Box(new Rect(10, 10, 460, 520), "Empire Systems");
            var y = 40;

            if (GUI.Button(new Rect(20, y, 145, 26), "Laboratory"))
            {
                _message = BuildWithVisual("laboratory", () => buildingSandbox.PlaceLaboratory(), "Laboratory");
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Army Camp"))
            {
                _message = BuildWithVisual("army_camp", () => buildingSandbox.PlaceArmyCamp(), "Army Camp");
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Barrack"))
            {
                _message = BuildWithVisual("barrack", () => buildingSandbox.PlaceBarrack(), "Barrack");
            }

            y += 32;
            if (GUI.Button(new Rect(20, y, 145, 26), "Wall"))
            {
                _message = BuildWithVisual("wall", () => buildingSandbox.PlaceWall(), "Wall");
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Archer Tower"))
            {
                var data = runtime.Build("archer_tower", Random.Range(3, 100));
                var visual = buildingSandbox.PlaceArcherTower();
                _message = (data && visual) ? "Archer Tower deployed." : "Archer Tower failed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Mortar"))
            {
                var data = runtime.Build("mortar", Random.Range(3, 100));
                var visual = buildingSandbox.PlaceMortar();
                _message = (data && visual) ? "Mortar deployed." : "Mortar failed.";
            }

            y += 36;
            if (GUI.Button(new Rect(20, y, 108, 26), "Swordsmen"))
            {
                _message = runtime.Train("swordsman", 5) ? "Swordsmen trained." : "Training failed.";
            }
            if (GUI.Button(new Rect(132, y, 108, 26), "Cavalry"))
            {
                _message = runtime.Train("cavalry", 3) ? "Cavalry trained." : "Training failed.";
            }
            if (GUI.Button(new Rect(244, y, 108, 26), "Catapult"))
            {
                _message = runtime.Train("catapult", 2) ? "Catapult trained." : "Training failed.";
            }
            if (GUI.Button(new Rect(356, y, 103, 26), "Witch"))
            {
                _message = runtime.Train("witch", 3) ? "Witches trained." : "Dark training failed.";
            }

            y += 32;
            if (GUI.Button(new Rect(20, y, 145, 26), "Recruit Hero"))
            {
                _message = runtime.RecruitHero("warlord_ash") ? "Warlord Ash joined." : "Recruit failed.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Hero Ability"))
            {
                _message = runtime.UseAbility("warlord_ash", "warcry") ? "War Cry activated." : "Ability on cooldown or unavailable.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Assign Dragon"))
            {
                _message = runtime.AssignPet("warlord_ash", "dragon_pet") ? "Dragon pet assigned." : "Pet assign failed.";
            }

            y += 32;
            if (GUI.Button(new Rect(20, y, 145, 26), "Hospital Heal"))
            {
                _message = runtime.Heal("swordsman", 2) ? "Injured healed." : "No injured or not enough resources.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Start Research"))
            {
                _message = runtime.StartResearch("dark_alchemy") ? "Dark Alchemy started." : "Research busy/fail.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Battle"))
            {
                _message = runtime.Battle(1500) ? "Victory in skirmish." : "Defeat in skirmish.";
            }

            y += 32;
            if (GUI.Button(new Rect(20, y, 145, 26), "Buy Builder"))
            {
                _message = runtime.BuyBuilder() ? "Builder purchased." : "Need more gems.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Upgrade Builder"))
            {
                _message = runtime.UpgradeBuilder() ? "Builder upgraded." : "Upgrade failed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Buy Decoration"))
            {
                _message = runtime.BuyDecoration(
                    "deco_statue",
                    "Royal Statue",
                    new Dictionary<ResourceType, int> { [ResourceType.Gold] = 180, [ResourceType.Gems] = 8 })
                    ? "Decoration purchased."
                    : "Purchase failed.";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 145, 26), "Open Chest"))
            {
                _message = runtime.OpenChest($"chest_{Random.Range(1, 999)}") ? "Chest opened. Rewards + boost granted." : "Chest already opened.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Claim Gift"))
            {
                runtime.ClaimGift();
                _message = "Random gift claimed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Guild Shop"))
            {
                _message = runtime.BuyGuildItem("guild_food_pack") ? "Guild shop purchase complete." : "Not enough guild tokens.";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 145, 26), "Donate Troops"))
            {
                _message = runtime.DonateClanTroops("swordsman", 2) ? "Troops donated to clan castle." : "Donation failed.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Donate Tokens"))
            {
                _message = runtime.DonateClanTokens(4) ? "Tokens donated to clan castle." : "Token donation failed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Defend Troll"))
            {
                _message = runtime.DefendTrollRaid() ? "Base defended against trolls." : "Defense failed. Regroup!";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 145, 26), "Scout Base"))
            {
                _visitMessage = runtime.ScoutEnemyBase("troll_camp_alpha");
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Attack Troll"))
            {
                _message = runtime.AttackEnemyBase("troll_camp_alpha") ? "Troll base defeated." : "Attack failed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Clan War"))
            {
                runtime.StartClanWar();
                _message = "Clan war started.";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 145, 26), "War Battle"))
            {
                _message = runtime.ClanWarBattle(1700) ? "Clan war victory points gained." : "Clan war battle lost.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Upgrade TownHall"))
            {
                _message = runtime.UpgradeTownHall() ? "TownHall upgraded." : "TownHall upgrade failed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "Expand Land"))
            {
                _message = runtime.ExpandLand() ? "Land expanded." : "Cannot expand (TH/cost/max).";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 145, 26), "Upgrade TH Building"))
            {
                _message = runtime.Upgrade("town_hall", 0) ? "TownHall upgrade started." : "Upgrade start failed.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "Cancel Upgrade"))
            {
                _message = runtime.CancelUpgrade() ? "Upgrade canceled, 80% refunded." : "No active upgrade.";
            }

            y += 34;
            if (GUI.Button(new Rect(20, y, 145, 26), "VIP Silver"))
            {
                _message = runtime.BuyVipPackage("vip_silver") ? "VIP Silver activated." : "VIP purchase failed.";
            }
            if (GUI.Button(new Rect(172, y, 145, 26), "VIP Gold"))
            {
                _message = runtime.BuyVipPackage("vip_gold") ? "VIP Gold activated." : "VIP purchase failed.";
            }
            if (GUI.Button(new Rect(324, y, 135, 26), "VIP Shop"))
            {
                _message = runtime.BuyVipShopItem("vip_elixir_crate") ? "VIP shop reward claimed." : "VIP shop locked/insufficient tokens.";
            }

            GUI.Label(new Rect(20, 496, 430, 24), _message);
        }

        private void DrawRightPanel()
        {
            GUI.Box(new Rect(Screen.width - 420, 10, 410, 520), "Profile, Achievements & Social");
            var state = runtime.State;
            var y = 40;

            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), $"Player: {state.Player.Name} | TH Power: {state.Player.TownHallPower} | Builders: {state.Player.BuildersOwned} (Lv {state.Player.BuilderLevel})");
            y += 24;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), $"TownHall Lv: {state.Player.TownHallLevel} | Land Lv: {state.Player.LandExpansionLevel}/{state.Player.MaxLandExpansionLevel}");
            y += 24;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), $"VIP Lv: {state.Player.VipLevel} | VIP Points: {state.Player.VipPoints} | VIP Tokens: {state.VipTokens}");
            y += 24;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), $"Profile: {state.Profile.Tag} | Motto: {state.Profile.Motto}");
            y += 24;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), $"Badges: {string.Join(", ", state.Badges.DefaultIfEmpty("None"))}");
            y += 24;
            state.Resources.TryGetValue(ResourceType.GuildCoins, out var guildCoins);
            state.Resources.TryGetValue(ResourceType.ClanTokens, out var clanTokens);
            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), $"GuildCoins: {guildCoins:0} | ClanTokens: {clanTokens:0}");
            y += 28;

            if (GUI.Button(new Rect(Screen.width - 410, y, 130, 26), "Challenge"))
            {
                _message = runtime.CompleteChallenge("raise_army") ? "Challenge completed." : "Challenge not ready.";
            }
            if (GUI.Button(new Rect(Screen.width - 275, y, 130, 26), "Event"))
            {
                _message = runtime.CompleteEvent("royal_festival") ? "Event completed." : "Event already done.";
            }
            if (GUI.Button(new Rect(Screen.width - 140, y, 120, 26), "Achievement"))
            {
                _message = runtime.ClaimAchievement("architect") ? "Achievement claimed + badge earned." : "Achievement conditions unmet.";
            }
            y += 34;

            if (GUI.Button(new Rect(Screen.width - 410, y, 180, 26), "Customize Profile"))
            {
                runtime.UpdateProfile("Steel heart, silent strike.", "theme_twilight");
                _message = "Profile customized.";
            }
            if (GUI.Button(new Rect(Screen.width - 224, y, 120, 26), "Visit Base"))
            {
                _visitMessage = runtime.VisitBase("StormRuler");
            }
            y += 34;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 30), _visitMessage);
            y += 36;

            var board = runtime.GetLeaderboard();
            GUI.Label(new Rect(Screen.width - 410, y, 250, 22), "Leaderboard");
            y += 22;
            foreach (var entry in board.Take(3))
            {
                GUI.Label(new Rect(Screen.width - 410, y, 390, 20), $"#{entry.Rank} {entry.PlayerName} - Power {entry.Power}");
                y += 20;
            }

            y += 14;
            var battleStatus = battleDirector != null && battleDirector.BattleRunning ? "Arena: Live combat sequence" : "Arena: cooldown";
            GUI.Label(new Rect(Screen.width - 410, y, 390, 22), battleStatus);
            y += 24;

            var hero = state.Heroes.FirstOrDefault();
            if (hero != null)
            {
                GUI.Label(new Rect(Screen.width - 410, y, 390, 20), $"Hero {hero.Id} Lv {hero.Level} | Pet: {hero.ActivePetId}");
                y += 20;
            }

            var injuredCount = state.InjuredUnits.Values.Sum();
            GUI.Label(new Rect(Screen.width - 410, y, 390, 20), $"Injured Soldiers: {injuredCount}");
            y += 22;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 20), $"Clan Castle Donations - Troops: {state.ClanCastleTroopDonations}, Tokens: {state.ClanCastleTokenDonations}");
            y += 22;
            var activeBoosts = state.ActiveBoosts.Any()
                ? string.Join(" | ", state.ActiveBoosts.Select(b => $"{b.Type} x{b.Multiplier:0.00} ({b.RemainingSeconds:0}s)"))
                : "None";
            GUI.Label(new Rect(Screen.width - 410, y, 390, 36), $"Active Boosts: {activeBoosts}");
            y += 38;
            GUI.Label(new Rect(Screen.width - 410, y, 390, 20), $"Clan War: {(state.ClanWar.Active ? "Active" : "Idle")} {state.ClanWar.ClanWarPoints}-{state.ClanWar.EnemyClanPoints}");
            y += 22;
            var up = state.ActiveBuildingUpgrade;
            var upText = up.RemainingSeconds > 0f
                ? $"{up.BuildingId} slot {up.SlotIndex} ({up.RemainingSeconds:0}s)"
                : "None";
            GUI.Label(new Rect(Screen.width - 410, y, 390, 20), $"Active Upgrade: {upText}");
        }

        private string BuildWithVisual(string id, System.Func<bool> visualBuild, string label)
        {
            var builtData = runtime.Build(id, Random.Range(3, 100));
            var builtVisual = visualBuild();
            return (builtData && builtVisual) ? $"{label} added." : $"{label} build failed.";
        }
    }
}
