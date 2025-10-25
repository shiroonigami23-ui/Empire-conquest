// ===================================
// RESOURCE MANAGEMENT SYSTEM
// ===================================

// Global game state for resources
const gameState = {
  resources: {
    gold: 1000,
    food: 800,
    wood: 600,
    stone: 400,
    iron: 200,
    gems: 100,
    mana: 50,
    honor: 0,
    guild_coins: 0,
    event_tokens: 0
  },
  production: {
    gold: 0,
    food: 0,
    wood: 0,
    stone: 0,
    iron: 0
  },
  player: {
    name: 'Emperor',
    level: 1,
    avatar: 'E',
    xp: 0,
    maxXp: 100
  },
  stats: {
    buildingsConstructed: 0,
    unitsTrained: 0,
    battlesWon: 0,
    researchCompleted: 0,
    equipmentCollected: 0,
    petsCollected: 0,
    achievementsUnlocked: 0
  },
  vip: {
    level: 0,
    points: 0,
    pointsToNext: 100
  },
  equipment: [],
  pets: [],
  alliance: null,
  achievements: [],
  dailyRewards: {
    lastClaim: null,
    daysClaimed: 0
  },
  activeEvents: [],
  buildings: [],
  units: {},
  heroes: [],
  researched: [],
  researching: null,
  quests: []
};

// Initialize resource system
function initResources() {
  updateResourceDisplay();
  startProductionCycle();
}

// Update resource display in UI
function updateResourceDisplay() {
  document.getElementById('goldAmount').textContent = formatNumber(gameState.resources.gold);
  document.getElementById('foodAmount').textContent = formatNumber(gameState.resources.food);
  document.getElementById('woodAmount').textContent = formatNumber(gameState.resources.wood);
  document.getElementById('stoneAmount').textContent = formatNumber(gameState.resources.stone);
  document.getElementById('ironAmount').textContent = formatNumber(gameState.resources.iron);
  document.getElementById('gemsAmount').textContent = formatNumber(gameState.resources.gems);
  document.getElementById('manaAmount').textContent = formatNumber(gameState.resources.mana);
}

// Check if player has enough resources
function hasEnoughResources(cost) {
  for (let resource in cost) {
    if (gameState.resources[resource] < cost[resource]) {
      return false;
    }
  }
  return true;
}

// Deduct resources
function deductResources(cost) {
  for (let resource in cost) {
    gameState.resources[resource] -= cost[resource];
  }
  updateResourceDisplay();
}

// Add resources
function addResources(amount) {
  for (let resource in amount) {
    gameState.resources[resource] += amount[resource];
  }
  updateResourceDisplay();
}

// Calculate production rate based on buildings
function calculateProduction() {
  gameState.production = {
    gold: 0,
    food: 0,
    wood: 0,
    stone: 0,
    iron: 0
  };

  gameState.buildings.forEach(building => {
    const buildingData = buildingsData.find(b => b.id === building.id);
    if (buildingData && buildingData.production) {
      // Parse production string (e.g., "Gold: +50/hour")
      const prodMatch = buildingData.production.match(/([A-Za-z]+):\s*\+(\d+)\/hour/);
      if (prodMatch) {
        const resource = prodMatch[1].toLowerCase();
        const amount = parseInt(prodMatch[2]);
        // Apply level multiplier
        gameState.production[resource] += amount * building.level;
      }
    }
  });
}

// Production cycle - runs every 10 seconds, adds 1/360th of hourly production
function startProductionCycle() {
  setInterval(() => {
    calculateProduction();
    
    // Add production (hourly rate / 360 for 10-second intervals)
    for (let resource in gameState.production) {
      gameState.resources[resource] += gameState.production[resource] / 360;
    }
    
    updateResourceDisplay();
  }, 10000); // Every 10 seconds
}

// Format large numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return Math.floor(num).toString();
}

// Save player profile
function saveProfile(name, avatar) {
  gameState.player.name = name;
  gameState.player.avatar = avatar;
  
  // Update UI
  document.getElementById('playerName').textContent = name;
  document.getElementById('avatarInitial').textContent = avatar;
  
  showNotification('Profile updated successfully!');
}

// Add XP and check for level up
function addXP(amount) {
  gameState.player.xp += amount;
  
  while (gameState.player.xp >= gameState.player.maxXp) {
    gameState.player.xp -= gameState.player.maxXp;
    gameState.player.level++;
    gameState.player.maxXp = Math.floor(gameState.player.maxXp * 1.5);
    
    showNotification(`Level Up! You are now level ${gameState.player.level}!`);
    document.getElementById('playerLevel').textContent = gameState.player.level;
  }
}