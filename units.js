// ===================================
// UNIT TRAINING SYSTEM
// ===================================

// Units data from JSON
const unitsData = [
  {
    id: 'warrior',
    name: 'Warrior',
    icon: '🧍',
    type: 'Infantry',
    cost: { gold: 50, food: 20 },
    train_time: 10,
    stats: { hp: 100, attack: 15, defense: 10, speed: 5 }
  },
  {
    id: 'archer',
    name: 'Archer',
    icon: '🎯',
    type: 'Ranged',
    cost: { gold: 60, food: 15, wood: 20 },
    train_time: 12,
    stats: { hp: 70, attack: 20, defense: 5, speed: 6 }
  },
  {
    id: 'cavalry',
    name: 'Cavalry',
    icon: '🐎',
    type: 'Cavalry',
    cost: { gold: 100, food: 30, iron: 15 },
    train_time: 18,
    stats: { hp: 120, attack: 25, defense: 12, speed: 10 }
  },
  {
    id: 'catapult',
    name: 'Catapult',
    icon: '🪨',
    type: 'Siege',
    cost: { gold: 200, wood: 100, iron: 50 },
    train_time: 30,
    stats: { hp: 80, attack: 50, defense: 5, speed: 3 }
  }
];

// Initialize unit counts
if (!gameState.units || Object.keys(gameState.units).length === 0) {
  gameState.units = {
    warrior: 10,
    archer: 5,
    cavalry: 2,
    catapult: 1
  };
}

// Initialize army modal
function initArmyModal() {
  populateUnitsGrid();
  updateArmyList();
}

// Populate units training grid
function populateUnitsGrid() {
  const unitsGrid = document.getElementById('unitsGrid');
  unitsGrid.innerHTML = '';

  unitsData.forEach(unit => {
    const canTrain = hasEnoughResources(unit.cost);
    
    let costHTML = '';
    for (let resource in unit.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${unit.cost[resource]}</span></div>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <div class="item-icon">${unit.icon}</div>
        <div class="item-info">
          <h3>${unit.name}</h3>
          <p>${unit.type}</p>
        </div>
      </div>
      <div class="item-stats">
        <div class="stat-row">
          <span>❤️ HP:</span>
          <span>${unit.stats.hp}</span>
        </div>
        <div class="stat-row">
          <span>⚔️ Attack:</span>
          <span>${unit.stats.attack}</span>
        </div>
        <div class="stat-row">
          <span>🛡️ Defense:</span>
          <span>${unit.stats.defense}</span>
        </div>
        <div class="stat-row">
          <span>⚡ Speed:</span>
          <span>${unit.stats.speed}</span>
        </div>
      </div>
      <div class="item-cost">${costHTML}</div>
      <div style="display: flex; gap: 10px; align-items: center; margin-top: 10px;">
        <input type="number" id="train_${unit.id}" min="1" max="100" value="1" 
               style="width: 60px; padding: 5px; border-radius: 4px; background: var(--bg-dark); 
                      border: 1px solid var(--border-color); color: var(--text-primary);">
        <button class="btn btn--success" style="flex: 1;"
                onclick="trainUnit('${unit.id}')" 
                ${!canTrain ? 'disabled' : ''}>
          Train
        </button>
      </div>
    `;

    unitsGrid.appendChild(card);
  });
}

// Train units
function trainUnit(unitId) {
  const unitData = unitsData.find(u => u.id === unitId);
  const countInput = document.getElementById(`train_${unitId}`);
  const count = parseInt(countInput.value) || 1;
  
  const totalCost = {};
  for (let resource in unitData.cost) {
    totalCost[resource] = unitData.cost[resource] * count;
  }
  
  if (!hasEnoughResources(totalCost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }

  deductResources(totalCost);
  
  if (!gameState.units[unitId]) {
    gameState.units[unitId] = 0;
  }
  gameState.units[unitId] += count;
  
  gameState.stats.unitsTrained += count;
  addXP(5 * count);
  
  showNotification(`${count} ${unitData.name}(s) trained!`);
  updateArmyList();
  populateUnitsGrid();
}

// Update army list view
function updateArmyList() {
  const armyList = document.getElementById('armyList');
  armyList.innerHTML = '';

  if (Object.keys(gameState.units).length === 0 || Object.values(gameState.units).every(v => v === 0)) {
    armyList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No units trained yet. Train some units to build your army!</p>';
    return;
  }

  unitsData.forEach(unitData => {
    const count = gameState.units[unitData.id] || 0;
    
    if (count > 0) {
      const listItem = document.createElement('div');
      listItem.className = 'list-item';
      listItem.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="font-size: 36px;">${unitData.icon}</div>
          <div class="list-item-info">
            <div class="list-item-title">${unitData.name} x${count}</div>
            <div class="list-item-desc">${unitData.type} | HP: ${unitData.stats.hp} | ATK: ${unitData.stats.attack}</div>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: bold; color: var(--color-primary);">${count}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">units</div>
        </div>
      `;
      armyList.appendChild(listItem);
    }
  });
}

// Calculate total army power
function calculateArmyPower() {
  let totalPower = 0;
  
  unitsData.forEach(unitData => {
    const count = gameState.units[unitData.id] || 0;
    const unitPower = (unitData.stats.hp + unitData.stats.attack + unitData.stats.defense) * count;
    totalPower += unitPower;
  });
  
  return totalPower;
}