// ===================================
// COMBAT SYSTEM (PvE & PvP)
// ===================================

// PvE Campaign stages
const campaignStages = [
  {
    id: 1,
    name: 'Bandit Camp',
    description: 'Clear out the nearby bandit camp',
    difficulty: 'Easy',
    enemyPower: 500,
    rewards: { gold: 200, food: 100, xp: 20 }
  },
  {
    id: 2,
    name: 'Goblin Fortress',
    description: 'Assault the goblin fortress',
    difficulty: 'Medium',
    enemyPower: 1200,
    rewards: { gold: 400, wood: 200, xp: 35 }
  },
  {
    id: 3,
    name: 'Orc Stronghold',
    description: 'Conquer the orc stronghold',
    difficulty: 'Hard',
    enemyPower: 2500,
    rewards: { gold: 600, stone: 300, iron: 100, xp: 50 }
  },
  {
    id: 4,
    name: 'Dragon Lair',
    description: 'Defeat the ancient dragon',
    difficulty: 'Very Hard',
    enemyPower: 5000,
    rewards: { gold: 1000, food: 400, wood: 400, stone: 400, iron: 200, xp: 100 }
  },
  {
    id: 5,
    name: 'Dark Castle',
    description: 'Storm the dark lord\'s castle',
    difficulty: 'Extreme',
    enemyPower: 8000,
    rewards: { gold: 2000, food: 600, wood: 600, stone: 600, iron: 400, xp: 200 }
  }
];

// Mock opponent data for PvP
const mockOpponents = [
  { id: 1, name: 'Lord Blackwood', level: 3, power: 800 },
  { id: 2, name: 'Baron Ironforge', level: 5, power: 1500 },
  { id: 3, name: 'Duke Stormwind', level: 7, power: 2200 },
  { id: 4, name: 'Count Shadowmere', level: 9, power: 3500 },
  { id: 5, name: 'King Dragonheart', level: 12, power: 5000 }
];

let selectedOpponent = null;

// Initialize combat modal
function initCombatModal() {
  populateCampaignStages();
  populatePvPInterface();
}

// Populate PvE campaign stages
function populateCampaignStages() {
  const campaignList = document.getElementById('campaignList');
  campaignList.innerHTML = '';

  campaignStages.forEach(stage => {
    const playerPower = calculateArmyPower() + calculateHeroPower();
    const canWin = playerPower >= stage.enemyPower * 0.8; // 80% chance threshold
    
    const difficultyColors = {
      'Easy': 'var(--color-success)',
      'Medium': 'var(--color-info)',
      'Hard': 'var(--color-warning)',
      'Very Hard': 'var(--color-danger)',
      'Extreme': '#9333ea'
    };

    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.innerHTML = `
      <div class="list-item-info">
        <div class="list-item-title">Stage ${stage.id}: ${stage.name}</div>
        <div class="list-item-desc">${stage.description}</div>
        <div style="margin-top: 8px; display: flex; gap: 15px; font-size: 12px;">
          <span style="color: ${difficultyColors[stage.difficulty]}; font-weight: bold;">${stage.difficulty}</span>
          <span>💪 Enemy Power: ${stage.enemyPower}</span>
          <span>🎯 Your Power: ${playerPower}</span>
        </div>
      </div>
      <button class="btn ${canWin ? 'btn--success' : 'btn--warning'}" 
              onclick="startPvEBattle(${stage.id})">
        ${canWin ? 'Attack' : 'Challenge'}
      </button>
    `;

    campaignList.appendChild(listItem);
  });
}

// Start PvE battle
function startPvEBattle(stageId) {
  const stage = campaignStages.find(s => s.id === stageId);
  if (!stage) return;

  const playerPower = calculateArmyPower() + calculateHeroPower();
  
  // Calculate win chance based on power difference
  const powerRatio = playerPower / stage.enemyPower;
  const baseWinChance = Math.min(0.95, Math.max(0.05, powerRatio * 0.6));
  const randomFactor = Math.random();
  
  const victory = randomFactor < baseWinChance;
  
  // Show battle animation (simplified)
  setTimeout(() => {
    showBattleResult(victory, stage.rewards, stage.name, 'pve');
  }, 1000);
}

// Populate PvP interface
function populatePvPInterface() {
  const pvpContainer = document.getElementById('pvpContainer');
  
  pvpContainer.innerHTML = `
    <div class="opponent-selector">
      <h3>Select Your Opponent</h3>
      <div class="opponent-list" id="opponentList"></div>
    </div>
    <div style="margin-top: 20px; text-align: center;">
      <button class="btn btn--danger" style="font-size: 18px; padding: 15px 40px;" 
              onclick="startPvPBattle()" id="pvpAttackBtn" disabled>
        ⚡ ATTACK!
      </button>
    </div>
  `;

  const opponentList = document.getElementById('opponentList');
  
  mockOpponents.forEach(opponent => {
    const card = document.createElement('div');
    card.className = 'opponent-card';
    card.onclick = () => selectOpponent(opponent.id);
    
    card.innerHTML = `
      <div style="font-size: 36px; margin-bottom: 10px;">🤴</div>
      <div style="font-weight: bold; margin-bottom: 5px;">${opponent.name}</div>
      <div style="font-size: 12px; color: var(--text-secondary);">Level ${opponent.level}</div>
      <div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">
        💪 Power: ${opponent.power}
      </div>
    `;
    
    opponentList.appendChild(card);
  });
}

// Select opponent for PvP
function selectOpponent(opponentId) {
  selectedOpponent = opponentId;
  
  // Update UI
  document.querySelectorAll('.opponent-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  event.target.closest('.opponent-card').classList.add('selected');
  document.getElementById('pvpAttackBtn').disabled = false;
}

// Start PvP battle
function startPvPBattle() {
  if (!selectedOpponent) {
    showNotification('Please select an opponent!', 'error');
    return;
  }

  const opponent = mockOpponents.find(o => o.id === selectedOpponent);
  const playerPower = calculateArmyPower() + calculateHeroPower();
  
  // Calculate win chance
  const powerRatio = playerPower / opponent.power;
  const baseWinChance = Math.min(0.90, Math.max(0.10, powerRatio * 0.55));
  const randomFactor = Math.random();
  
  const victory = randomFactor < baseWinChance;
  
  // Calculate rewards based on opponent level
  const rewards = {
    gold: opponent.level * 150,
    food: opponent.level * 50,
    xp: opponent.level * 15
  };
  
  // Show battle animation
  setTimeout(() => {
    showBattleResult(victory, rewards, opponent.name, 'pvp');
    selectedOpponent = null;
    populatePvPInterface();
  }, 1000);
}

// Show battle result modal
function showBattleResult(victory, rewards, enemyName, battleType) {
  const modal = document.getElementById('battleResultModal');
  const title = document.getElementById('battleResultTitle');
  const body = document.getElementById('battleResultBody');
  
  title.textContent = victory ? 'VICTORY!' : 'DEFEAT';
  
  let rewardsHTML = '';
  if (victory) {
    for (let resource in rewards) {
      if (resource === 'xp') continue;
      const icon = getResourceIcon(resource);
      rewardsHTML += `<div class="reward-item">${icon} <span>+${rewards[resource]}</span></div>`;
    }
    
    // Grant rewards
    const resourceRewards = { ...rewards };
    delete resourceRewards.xp;
    addResources(resourceRewards);
    if (rewards.xp) addXP(rewards.xp);
    
    gameState.stats.battlesWon++;
  }
  
  body.innerHTML = `
    <div class="battle-result ${victory ? 'victory' : 'defeat'}">
      <div class="battle-result-icon">${victory ? '🏆' : '☠️'}</div>
      <div class="battle-result-title">${victory ? 'Victory!' : 'Defeat'}</div>
      <p style="color: var(--text-secondary); margin: 15px 0;">
        ${victory ? 
          `You have defeated ${enemyName}!` : 
          `You were defeated by ${enemyName}. Train more units and try again!`
        }
      </p>
      ${victory ? `
        <div class="battle-rewards">
          <h3>Rewards</h3>
          <div class="reward-list">
            ${rewardsHTML}
            ${rewards.xp ? `<div class="reward-item">⭐ <span>+${rewards.xp} XP</span></div>` : ''}
          </div>
        </div>
      ` : ''}
      <button class="btn btn--primary" style="margin-top: 20px;" 
              onclick="closeModal('battleResultModal')">
        Continue
      </button>
    </div>
  `;
  
  closeModal('combatModal');
  modal.classList.add('active');
}