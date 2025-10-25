// ===================================
// PET SYSTEM
// ===================================

const petsData = [
  { id: 'dragon_baby', name: 'Baby Dragon', type: 'Combat', icon: '🐉', rarity: 'Rare', stats: { attack: 50, hp: 200 }, skill: 'Fire Breath', cost: { gold: 2000, gems: 20 } },
  { id: 'phoenix', name: 'Phoenix', type: 'Combat', icon: '🦅', rarity: 'Epic', stats: { attack: 80, hp: 300 }, skill: 'Rebirth', cost: { gold: 5000, gems: 50 } },
  { id: 'wolf', name: 'Dire Wolf', type: 'Combat', icon: '🐺', rarity: 'Common', stats: { attack: 30, hp: 150 }, skill: 'Pack Hunter', cost: { gold: 1000 } },
  { id: 'tiger', name: 'War Tiger', type: 'Combat', icon: '🐅', rarity: 'Rare', stats: { attack: 60, hp: 250 }, skill: 'Pounce', cost: { gold: 2500, gems: 25 } },
  { id: 'bear', name: 'Guardian Bear', type: 'Defense', icon: '🐻', rarity: 'Rare', stats: { defense: 50, hp: 400 }, skill: 'Iron Hide', cost: { gold: 2200, gems: 22 } },
  { id: 'turtle', name: 'Ancient Turtle', type: 'Defense', icon: '🐢', rarity: 'Epic', stats: { defense: 80, hp: 600 }, skill: 'Shell Shield', cost: { gold: 4500, gems: 45 } },
  { id: 'rabbit', name: 'Lucky Rabbit', type: 'Gathering', icon: '🐰', rarity: 'Common', stats: { gathering: 30 }, skill: 'Quick Gather', cost: { gold: 800 } },
  { id: 'ox', name: 'Golden Ox', type: 'Gathering', icon: '🐂', rarity: 'Rare', stats: { gathering: 60 }, skill: 'Rich Harvest', cost: { gold: 2000, gems: 20 } },
  { id: 'owl', name: 'Wise Owl', type: 'Support', icon: '🦉', rarity: 'Rare', stats: { leadership: 30 }, skill: 'Strategy', cost: { gold: 1800, gems: 18 } },
  { id: 'unicorn', name: 'Unicorn', type: 'Support', icon: '🦄', rarity: 'Legendary', stats: { leadership: 60, hp: 300 }, skill: 'Divine Blessing', cost: { gold: 10000, gems: 100 } }
];

// Initialize pets
if (!gameState.pets) {
  gameState.pets = [];
}

// Initialize pets modal
function initPetsModal() {
  populatePetsGrid();
  populateMyPetsList();
  populateEvolvePetsTab();
}

// Populate pets collection grid
function populatePetsGrid() {
  const grid = document.getElementById('petsGrid');
  grid.innerHTML = '';
  
  petsData.forEach(pet => {
    const owned = gameState.pets.find(p => p.id === pet.id);
    const canPurchase = !owned && hasEnoughResources(pet.cost);
    
    let costHTML = '';
    for (let resource in pet.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${pet.cost[resource]}</span></div>`;
    }
    
    let statsHTML = '';
    for (let stat in pet.stats) {
      statsHTML += `<div class="stat-row"><span>${stat}:</span><span>+${pet.stats[stat]}</span></div>`;
    }
    
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.borderColor = rarityColors[pet.rarity];
    
    card.innerHTML = `
      <div class="item-card-header">
        <div class="item-icon">${pet.icon}</div>
        <div class="item-info">
          <h3>${pet.name}</h3>
          <p style="color: ${rarityColors[pet.rarity]}">${pet.rarity} ${pet.type}</p>
        </div>
      </div>
      <div style="font-size: 11px; color: var(--text-secondary); margin: 8px 0;">
        <strong>Skill:</strong> ${pet.skill}
      </div>
      <div class="item-stats">${statsHTML}</div>
      <div class="item-cost">${costHTML}</div>
      ${owned ? 
        '<button class="btn btn--success" disabled>Owned</button>' :
        `<button class="btn btn--primary" onclick="collectPet('${pet.id}')" ${!canPurchase ? 'disabled' : ''}>Collect</button>`
      }
    `;
    
    grid.appendChild(card);
  });
}

// Collect/purchase pet
function collectPet(petId) {
  const petData = petsData.find(p => p.id === petId);
  if (!petData || gameState.pets.some(p => p.id === petId)) return;
  
  if (!hasEnoughResources(petData.cost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }
  
  deductResources(petData.cost);
  
  gameState.pets.push({
    id: petId,
    level: 1,
    xp: 0,
    maxXp: 100,
    assignedTo: null
  });
  
  gameState.stats.petsCollected++;
  addXP(30);
  
  showNotification(`Collected ${petData.name}!`);
  populatePetsGrid();
  populateMyPetsList();
}

// Populate my pets list
function populateMyPetsList() {
  const list = document.getElementById('myPetsList');
  
  if (gameState.pets.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No pets collected yet. Collect pets to boost your power!</p>';
    return;
  }
  
  list.innerHTML = '';
  
  gameState.pets.forEach((pet, index) => {
    const petData = petsData.find(p => p.id === pet.id);
    if (!petData) return;
    
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.style.flexDirection = 'column';
    listItem.style.alignItems = 'flex-start';
    
    let statsHTML = '';
    for (let stat in petData.stats) {
      statsHTML += `<div style="text-align: center;"><div style="font-size: 10px; color: var(--text-secondary);">${stat}</div><div style="font-weight: bold;">${petData.stats[stat] + (pet.level - 1) * 5}</div></div>`;
    }
    
    listItem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; width: 100%; margin-bottom: 10px;">
        <div style="font-size: 48px;">${petData.icon}</div>
        <div style="flex: 1;">
          <div class="list-item-title">${petData.name}</div>
          <div class="list-item-desc">${petData.type} Pet | Level ${pet.level}</div>
        </div>
        <button class="btn btn--success" onclick="levelUpPet(${index})" style="padding: 8px 16px;">Level Up</button>
      </div>
      <div class="progress-bar" style="width: 100%; margin-bottom: 10px;">
        <div class="progress-fill" style="width: ${(pet.xp / pet.maxXp) * 100}%;">${pet.xp}/${pet.maxXp} XP</div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 10px; width: 100%;">
        ${statsHTML}
      </div>
    `;
    
    list.appendChild(listItem);
  });
}

// Level up pet
function levelUpPet(petIndex) {
  const pet = gameState.pets[petIndex];
  const petData = petsData.find(p => p.id === pet.id);
  if (!pet || !petData) return;
  
  const levelUpCost = { gold: pet.level * 300 };
  
  if (!hasEnoughResources(levelUpCost)) {
    showNotification('Not enough gold!', 'error');
    return;
  }
  
  deductResources(levelUpCost);
  pet.level++;
  pet.xp = 0;
  pet.maxXp = Math.floor(pet.maxXp * 1.5);
  
  showNotification(`${petData.name} is now level ${pet.level}!`);
  populateMyPetsList();
}

// Populate evolve pets tab
function populateEvolvePetsTab() {
  const content = document.getElementById('evolvePetsContent');
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h3>Pet Evolution</h3>
      <p style="color: var(--text-secondary); margin: 15px 0;">Combine pets to evolve them into more powerful forms!</p>
      <p style="color: var(--color-warning);">Evolution system coming soon!</p>
    </div>
  `;
}

// Calculate total pet bonuses
function calculatePetBonuses() {
  const bonuses = { attack: 0, defense: 0, hp: 0, gathering: 0, leadership: 0 };
  
  gameState.pets.forEach(pet => {
    const petData = petsData.find(p => p.id === pet.id);
    if (petData) {
      for (let stat in petData.stats) {
        if (bonuses[stat] !== undefined) {
          bonuses[stat] += petData.stats[stat] + (pet.level - 1) * 5;
        }
      }
    }
  });
  
  return bonuses;
}