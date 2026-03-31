using System;
using System.Collections.Generic;

namespace EmpireConquest.Core
{
    public enum ResourceType
    {
        Gold,
        Food,
        Wood,
        Stone,
        Iron,
        Gems,
        Mana,
        Honor,
        GuildCoins,
        ClanTokens,
        EventTokens,
        Coal,
        Plank,
        Brick
    }

    public enum AchievementCategory
    {
        Economy,
        Army,
        Defense,
        Progression,
        Social
    }

    public enum BoostType
    {
        Building,
        Training,
        Healing
    }

    [Serializable]
    public class PlayerState
    {
        public string Name = "Emperor";
        public int Level = 1;
        public int Xp = 0;
        public int MaxXp = 100;
        public int BuildersOwned = 1;
        public int BuilderLevel = 1;
        public int TownHallPower = 100;
        public int TownHallLevel = 1;
        public int LandExpansionLevel = 1;
        public int MaxLandExpansionLevel = 6;
        public int MiningResearchLevel = 0;
        public int TroopResearchLevel = 0;
    }

    [Serializable]
    public class ProfileState
    {
        public string Tag = "#EMPIRE001";
        public string Motto = "Build. Conquer. Rise.";
        public string AvatarId = "avatar_default";
        public string BannerId = "banner_royal";
        public string ThemeId = "theme_crimson";
        public string FavoriteHeroId = "";
    }

    [Serializable]
    public class BuildingDefinition
    {
        public string Id = "";
        public string Name = "";
        public int MaxLevel = 1;
        public int PowerPerLevel = 10;
        public int RequiredTownHallLevel = 1;
        public bool IsStorage;
        public bool IsWall;
        public float UpgradeSeconds = 15f;
        public Dictionary<ResourceType, int> BaseCost = new();
        public Dictionary<ResourceType, int> HourlyProduction = new();
        public Dictionary<ResourceType, int> StorageBonus = new();
    }

    [Serializable]
    public class BuildingInstance
    {
        public string Id = "";
        public int Level = 1;
        public int SlotIndex = 0;
        public bool IsUpgrading;
    }

    [Serializable]
    public class BuildingUpgradeTask
    {
        public string BuildingId = "";
        public int SlotIndex;
        public float RemainingSeconds;
        public Dictionary<ResourceType, int> PaidCost = new();
    }

    [Serializable]
    public class UnitStats
    {
        public int Hp;
        public int Attack;
        public int Defense;
        public int Speed;
    }

    [Serializable]
    public class UnitDefinition
    {
        public string Id = "";
        public string Name = "";
        public string Type = "";
        public bool DarkUnit;
        public Dictionary<ResourceType, int> Cost = new();
        public int TrainTimeSeconds = 10;
        public UnitStats Stats = new();
    }

    [Serializable]
    public class HeroAbility
    {
        public string Id = "";
        public string Name = "";
        public string Description = "";
        public int CooldownSeconds = 30;
        public float AttackMultiplier = 1f;
        public float DefenseMultiplier = 1f;
    }

    [Serializable]
    public class PetDefinition
    {
        public string Id = "";
        public string Name = "";
        public string Type = "";
        public string IntroLine = "";
        public float HeroAttackBonus = 0.1f;
        public float HeroDefenseBonus = 0.1f;
    }

    [Serializable]
    public class HeroDefinition
    {
        public string Id = "";
        public string Name = "";
        public string HeroClass = "";
        public string IntroLine = "";
        public Dictionary<ResourceType, int> Cost = new();
        public int BaseHp;
        public int BaseAttack;
        public int BaseDefense;
        public int BaseLeadership;
        public List<HeroAbility> Abilities = new();
        public List<string> AllowedPetIds = new();
    }

    [Serializable]
    public class HeroInstance
    {
        public string Id = "";
        public int Level = 1;
        public int Xp = 0;
        public int MaxXp = 100;
        public string ActivePetId = "";
        public Dictionary<string, float> AbilityCooldowns = new();
    }

    [Serializable]
    public class TechnologyDefinition
    {
        public string Id = "";
        public string Name = "";
        public Dictionary<ResourceType, int> Cost = new();
        public int ResearchSeconds = 60;
        public string BonusType = "";
        public float BonusValue = 0f;
        public int RequiredTownHallLevel = 1;
        public bool IsMiningResearch;
        public bool IsTroopResearch;
    }

    [Serializable]
    public class EventDefinition
    {
        public string Id = "";
        public string Name = "";
        public string Description = "";
        public int DurationSeconds = 180;
        public Dictionary<ResourceType, int> Reward = new();
    }

    [Serializable]
    public class ChallengeDefinition
    {
        public string Id = "";
        public string Name = "";
        public string GoalType = "";
        public int GoalValue = 1;
        public Dictionary<ResourceType, int> Reward = new();
    }

    [Serializable]
    public class AchievementDefinition
    {
        public string Id = "";
        public string Name = "";
        public AchievementCategory Category = AchievementCategory.Progression;
        public string GoalType = "";
        public int GoalValue = 1;
        public string BadgeId = "";
        public Dictionary<ResourceType, int> Reward = new();
    }

    [Serializable]
    public class LeaderboardEntry
    {
        public string PlayerName = "";
        public int Power;
        public int Rank;
    }

    [Serializable]
    public class CampaignStage
    {
        public int Id;
        public string Name = "";
        public int EnemyPower;
        public Dictionary<ResourceType, int> Rewards = new();
        public int XpReward;
    }

    [Serializable]
    public class GuildShopItem
    {
        public string Id = "";
        public string Name = "";
        public int GuildTokenCost = 20;
        public Dictionary<ResourceType, int> Reward = new();
    }

    [Serializable]
    public class ActiveBoost
    {
        public BoostType Type = BoostType.Building;
        public float Multiplier = 1.25f;
        public float RemainingSeconds = 120f;
    }

    [Serializable]
    public class EnemyBaseDefinition
    {
        public string Id = "";
        public string Name = "";
        public string Map = "";
        public int Power = 600;
        public Dictionary<ResourceType, int> Reward = new();
    }

    [Serializable]
    public class ClanWarState
    {
        public bool Active;
        public int ClanWarPoints;
        public int EnemyClanPoints;
    }

    [Serializable]
    public class PlayerBaseProfile
    {
        public string Id = "";
        public string Name = "";
        public int EstimatedPower;
        public bool IsOnline;
        public Dictionary<string, int> DefensiveTroops = new();
    }

    [Serializable]
    public class StoreDecoration
    {
        public string Id = "";
        public string Name = "";
        public Dictionary<ResourceType, int> Cost = new();
    }

    [Serializable]
    public class GameState
    {
        public Dictionary<ResourceType, double> Resources = new();
        public Dictionary<ResourceType, double> ResourceCapacity = new();
        public Dictionary<ResourceType, double> ProductionPerHour = new();
        public PlayerState Player = new();
        public ProfileState Profile = new();
        public List<BuildingInstance> Buildings = new();
        public Dictionary<string, int> Units = new();
        public Dictionary<string, int> DefensiveTroops = new();
        public Dictionary<string, int> InjuredUnits = new();
        public List<HeroInstance> Heroes = new();
        public HashSet<string> OwnedPets = new();
        public HashSet<string> Researched = new();
        public string ResearchingTechnologyId = "";
        public HashSet<string> CompletedEvents = new();
        public HashSet<string> CompletedChallenges = new();
        public HashSet<string> ClaimedAchievements = new();
        public HashSet<string> Badges = new();
        public List<StoreDecoration> OwnedDecorations = new();
        public List<LeaderboardEntry> Leaderboard = new();
        public List<GuildShopItem> GuildShop = new();
        public List<ActiveBoost> ActiveBoosts = new();
        public HashSet<string> OpenedChests = new();
        public int ClanCastleTroopDonations;
        public int ClanCastleTokenDonations;
        public List<EnemyBaseDefinition> EnemyBases = new();
        public string LastScoutedBaseId = "";
        public ClanWarState ClanWar = new();
        public BuildingUpgradeTask ActiveBuildingUpgrade = new();
        public List<PlayerBaseProfile> PlayerPool = new();
        public int DefendedAttacks;
    }
}
