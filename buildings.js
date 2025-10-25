// ===================================
// BUILDING SYSTEM
// ===================================

// Building data from JSON
const buildingsData = [
  {
    id: 'town_hall',
    name: 'Town Hall',
    icon: '🏛️',
    description: 'The heart of your empire. Upgrade to unlock more buildings.',
    max_level: 10,
    base_cost: { gold: 0, wood: 0, stone: 0 },
    base_build_time: 0,
    production: null,
    unlocks: ['All basic buildings']
  },
  {
    id: 'barracks',
    name: 'Barracks',
    icon: '⚔️',
    description: 'Train infantry units to defend your base and attack enemies.',
    max_level: 8,
    base_cost: { gold: 200, wood: 150, stone: 100 },
    base_build_time: 30,
    production: 'Infantry units',
    unlocks: ['Warriors, Swordsmen, Knights']
  },
  {
    id: 'archery_range',
    name: 'Archery Range',
    icon: '🎯',
    description: 'Train ranged units for long-distance attacks.',
    max_level: 8,
    base_cost: { gold: 250, wood: 200, stone: 50 },
    base_build_time: 35,
    production: 'Ranged units',
    unlocks: ['Archers, Crossbowmen, Longbowmen']
  },
  {
    id: 'stable',
    name: 'Stable',
    icon: '🐎',
    description: 'Train cavalry units for fast attacks.',
    max_level: 8,
    base_cost: { gold: 300, wood: 250, stone: 150 },
    base_build_time: 40,
    production: 'Cavalry units',
    unlocks: ['Light Cavalry, Heavy Cavalry, Paladins']
  },
  {
    id: 'workshop',
    name: 'Workshop',
    icon: '🔨',
    description: 'Build siege weapons to destroy enemy fortifications.',
    max_level: 6,
    base_cost: { gold: 400, wood: 300, stone: 250 },
    base_build_time: 50,
    production: 'Siege units',
    unlocks: ['Catapults, Trebuchets, Battering Rams']
  },
  {
    id: 'gold_mine',
    name: 'Gold Mine',
    icon: '💰',
    description: 'Generates gold over time.',
    max_level: 10,
    base_cost: { gold: 100, wood: 100, stone: 50 },
    base_build_time: 20,
    production: 'Gold: +50/hour',
    unlocks: null
  },
  {
    id: 'farm',
    name: 'Farm',
    icon: '🌾',
    description: 'Produces food for your population.',
    max_level: 10,
    base_cost: { gold: 80, wood: 120, stone: 0 },
    base_build_time: 15,
    production: 'Food: +60/hour',
    unlocks: null
  },
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    icon: '🪵',
    description: 'Harvests wood from nearby forests.',
    max_level: 10,
    base_cost: { gold: 90, wood: 50, stone: 60 },
    base_build_time: 18,
    production: 'Wood: +55/hour',
    unlocks: null
  },
  {
    id: 'quarry',
    name: 'Quarry',
    icon: '🪨',
    description: 'Extracts stone from the ground.',
    max_level: 10,
    base_cost: { gold: 120, wood: 80, stone: 40 },
    base_build_time: 22,
    production: 'Stone: +45/hour',
    unlocks: null
  },
  {
    id: 'iron_mine',
    name: 'Iron Mine',
    icon: '⚙️',
    description: 'Mines iron ore for advanced units.',
    max_level: 8,
    base_cost: { gold: 200, wood: 150, stone: 200 },
    base_build_time: 35,
    production: 'Iron: +30/hour',
    unlocks: null
  },
  {
    id: 'research_lab',
    name: 'Research Lab',
    icon: '🔬',
    description: 'Unlock new technologies and upgrades.',
    max_level: 10,
    base_cost: { gold: 500, wood: 300, stone: 400 },
    base_build_time: 60,
    production: null,
    unlocks: ['Technology tree access']
  },
  {
    id: 'wall',
    name: 'Wall',
    icon: '🧱',
    description: 'Defensive structure that protects your base.',
    max_level: 15,
    base_cost: { gold: 150, wood: 100, stone: 300 },
    base_build_time: 25,
    production: null,
    unlocks: null
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    icon: '🗼',
    description: 'Defensive tower that attacks nearby enemies.',
    max_level: 10,
    base_cost: { gold: 180, wood: 120, stone: 250 },
    base_build_time: 30,
    production: null,
    unlocks: null
  },
  {
    id: 'marketplace',
    name: 'Marketplace',
    icon: '🏪',
    description: 'Trade resources with other players.',
    max_level: 8,
    base_cost: { gold: 300, wood: 250, stone: 200 },
    base_build_time: 40,
    production: null,
    unlocks: ['Resource trading']
  },
  {
    id: 'hero_hall',
    name: 'Hero Hall',
    icon: '🦸',
    description: 'Recruit and upgrade heroes.',
    max_level: 8,
    base_cost: { gold: 600, wood: 400, stone: 500 },
    base_build_time: 70,
    production: null,
    unlocks: ['Hero recruitment']
  }
];

// Initialize building grid
function initBuildingGrid() {
  const gridContainer = document.getElementById('gridContainer');
  gridContainer.innerHTML = '';

  // Create town hall first
  if (gameState.buildings.length === 0) {
    gameState.buildings.push({
      id: 'town_hall',
      level: 1,
      slotIndex: 0
    });
  }

  // Create 15 building slots
  for (let i = 0; i < 15; i++) {
    const slot = document.createElement('div');
    slot.className = 'building-slot';
    slot.dataset.slotIndex = i;

    const building = gameState.buildings.find(b => b.slotIndex === i);
    
    if (building) {
      const buildingData = buildingsData.find(b => b.id === building.id);
      slot.classList.add('occupied');
      slot.innerHTML = `
        <div class="building-icon">${buildingData.icon}</div>
        <div class="building-name">${buildingData.name}</div>
        <div class="building-level">Level ${building.level}</div>
      `;
      slot.onclick = () => showBuildingDetails(building, buildingData);
    } else {
      slot.innerHTML = `
        <div class="building-icon">➕</div>
        <div class="building-name">Empty Slot</div>
      `;
      slot.onclick = () => showBuildingsList(i);
    }

    gridContainer.appendChild(slot);
  }
}

// Show building details modal
function showBuildingDetails(building, buildingData) {
  const modal = document.getElementById('buildingModal');
  const modalTitle = document.getElementById('buildingModalTitle');
  const modalBody = document.getElementById('buildingModalBody');

  modalTitle.textContent = buildingData.name;

  const upgradeCost = calculateUpgradeCost(buildingData, building.level);
  const canUpgrade = building.level < buildingData.max_level && hasEnoughResources(upgradeCost);

  let costHTML = '';
  for (let resource in upgradeCost) {
    const icon = getResourceIcon(resource);
    costHTML += `<div class="cost-item">${icon} <span>${upgradeCost[resource]}</span></div>`;
  }

  modalBody.innerHTML = `
    <div class="item-card-header">
      <div class="item-icon">${buildingData.icon}</div>
      <div class="item-info">
        <h3>${buildingData.name}</h3>
        <p>Level ${building.level}/${buildingData.max_level}</p>
      </div>
    </div>
    <p style="margin: 15px 0; color: var(--text-secondary);">${buildingData.description}</p>
    ${buildingData.production ? `<p><strong>Production:</strong> ${buildingData.production}</p>` : ''}
    ${buildingData.unlocks ? `<p><strong>Unlocks:</strong> ${buildingData.unlocks.join(', ')}</p>` : ''}
    <hr style="margin: 15px 0; border: 1px solid var(--border-color);">
    <h4>Upgrade to Level ${building.level + 1}</h4>
    <div class="item-cost">${costHTML}</div>
    <button class="btn btn--primary" 
            onclick="upgradeBuilding('${building.id}', ${building.slotIndex})" 
            ${!canUpgrade ? 'disabled' : ''}>
      ${building.level >= buildingData.max_level ? 'Max Level' : 'Upgrade'}
    </button>
  `;

  modal.classList.add('active');
}

// Show buildings list for empty slot
function showBuildingsList(slotIndex) {
  const modal = document.getElementById('buildingsListModal');
  const buildingsGrid = document.getElementById('buildingsGrid');

  buildingsGrid.innerHTML = '';

  buildingsData.forEach(building => {
    if (building.id === 'town_hall') return; // Skip town hall

    const canBuild = hasEnoughResources(building.base_cost);
    
    let costHTML = '';
    for (let resource in building.base_cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${building.base_cost[resource]}</span></div>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <div class="item-icon">${building.icon}</div>
        <div class="item-info">
          <h3>${building.name}</h3>
          <p>${building.description}</p>
        </div>
      </div>
      ${building.production ? `<div class="item-stats">Production: ${building.production}</div>` : ''}
      <div class="item-cost">${costHTML}</div>
      <button class="btn btn--success" 
              onclick="constructBuilding('${building.id}', ${slotIndex})" 
              ${!canBuild ? 'disabled' : ''}>
        Build
      </button>
    `;

    buildingsGrid.appendChild(card);
  });

  modal.classList.add('active');
}

// Calculate upgrade cost
function calculateUpgradeCost(buildingData, currentLevel) {
  const cost = {};
  for (let resource in buildingData.base_cost) {
    cost[resource] = Math.floor(buildingData.base_cost[resource] * Math.pow(1.5, currentLevel));
  }
  return cost;
}

// Construct new building
function constructBuilding(buildingId, slotIndex) {
  const buildingData = buildingsData.find(b => b.id === buildingId);
  
  if (!hasEnoughResources(buildingData.base_cost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }

  deductResources(buildingData.base_cost);
  
  gameState.buildings.push({
    id: buildingId,
    level: 1,
    slotIndex: slotIndex
  });

  gameState.stats.buildingsConstructed++;
  addXP(10);
  
  showNotification(`${buildingData.name} constructed!`);
  closeModal('buildingsListModal');
  initBuildingGrid();
}

// Upgrade building
function upgradeBuilding(buildingId, slotIndex) {
  const building = gameState.buildings.find(b => b.id === buildingId && b.slotIndex === slotIndex);
  const buildingData = buildingsData.find(b => b.id === buildingId);
  
  if (!building || building.level >= buildingData.max_level) {
    return;
  }

  const upgradeCost = calculateUpgradeCost(buildingData, building.level);
  
  if (!hasEnoughResources(upgradeCost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }

  deductResources(upgradeCost);
  building.level++;
  
  addXP(15);
  showNotification(`${buildingData.name} upgraded to level ${building.level}!`);
  closeModal('buildingModal');
  initBuildingGrid();
}

// Get resource icon
function getResourceIcon(resource) {
  const icons = {
    gold: '💰',
    food: '🌾',
    wood: '🪵',
    stone: '🪨',
    iron: '⚙️'
  };
  return icons[resource] || '❓';
}