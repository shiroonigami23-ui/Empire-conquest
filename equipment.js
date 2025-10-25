// ===================================
// EQUIPMENT SYSTEM
// ===================================

const equipmentData = [
  // Weapons
  { id: 'sword_basic', name: 'Iron Sword', slot: 'Weapon', rarity: 'Common', icon: '⚔️', stats: { attack: 15 }, cost: { gold: 500 } },
  { id: 'sword_rare', name: 'Dragon Slayer', slot: 'Weapon', rarity: 'Rare', icon: '⚔️', stats: { attack: 35 }, cost: { gold: 1500, iron: 100 } },
  { id: 'sword_epic', name: 'Excalibur', slot: 'Weapon', rarity: 'Epic', icon: '⚔️', stats: { attack: 75 }, cost: { gold: 5000, gems: 50 } },
  { id: 'staff_basic', name: 'Wooden Staff', slot: 'Weapon', rarity: 'Common', icon: '🪄', stats: { attack: 20, mana: 10 }, cost: { gold: 600, wood: 50 } },
  { id: 'bow_epic', name: 'Elven Longbow', slot: 'Weapon', rarity: 'Epic', icon: '🏹', stats: { attack: 65, speed: 5 }, cost: { gold: 4500, gems: 40 } },
  
  // Helmets
  { id: 'helm_basic', name: 'Leather Cap', slot: 'Helmet', rarity: 'Common', icon: '🫡', stats: { defense: 10 }, cost: { gold: 300 } },
  { id: 'helm_rare', name: 'Steel Helmet', slot: 'Helmet', rarity: 'Rare', icon: '🫡', stats: { defense: 25, hp: 50 }, cost: { gold: 1200, iron: 80 } },
  { id: 'helm_legendary', name: 'Crown of Kings', slot: 'Helmet', rarity: 'Legendary', icon: '👑', stats: { defense: 60, hp: 150, leadership: 20 }, cost: { gold: 10000, gems: 100 } },
  
  // Armor
  { id: 'armor_basic', name: 'Leather Armor', slot: 'Armor', rarity: 'Common', icon: '🤼', stats: { defense: 15, hp: 30 }, cost: { gold: 400 } },
  { id: 'armor_rare', name: 'Chainmail', slot: 'Armor', rarity: 'Rare', icon: '🤼', stats: { defense: 35, hp: 80 }, cost: { gold: 1500, iron: 100 } },
  { id: 'armor_epic', name: 'Dragon Scale Armor', slot: 'Armor', rarity: 'Epic', icon: '🤼', stats: { defense: 70, hp: 200 }, cost: { gold: 6000, gems: 60 } },
  
  // Boots
  { id: 'boots_basic', name: 'Simple Boots', slot: 'Boots', rarity: 'Common', icon: '🥾', stats: { speed: 2 }, cost: { gold: 250 } },
  { id: 'boots_rare', name: 'Swift Boots', slot: 'Boots', rarity: 'Rare', icon: '🥾', stats: { speed: 5, defense: 10 }, cost: { gold: 1000 } },
  { id: 'boots_legendary', name: 'Boots of Hermes', slot: 'Boots', rarity: 'Legendary', icon: '⚡', stats: { speed: 15, defense: 30 }, cost: { gold: 8000, gems: 80 } },
  
  // Rings
  { id: 'ring_basic', name: 'Bronze Ring', slot: 'Ring', rarity: 'Common', icon: '💍', stats: { attack: 5, defense: 5 }, cost: { gold: 350 } },
  { id: 'ring_epic', name: 'Ring of Power', slot: 'Ring', rarity: 'Epic', icon: '💍', stats: { attack: 30, defense: 30, hp: 50 }, cost: { gold: 5500, gems: 55 } },
  
  // Amulets
  { id: 'amulet_rare', name: 'Life Amulet', slot: 'Amulet', rarity: 'Rare', icon: '📿', stats: { hp: 100 }, cost: { gold: 1800 } },
  { id: 'amulet_legendary', name: 'Phoenix Pendant', slot: 'Amulet', rarity: 'Legendary', icon: '🔥', stats: { hp: 250, attack: 40, defense: 40 }, cost: { gold: 12000, gems: 120 } }
];

const rarityColors = {
  'Common': '#9ca3af',
  'Uncommon': '#22c55e',
  'Rare': '#3b82f6',
  'Epic': '#a855f7',
  'Legendary': '#eab308',
  'Mythic': '#ef4444'
};

// Initialize equipment inventory
if (!gameState.equipment) {
  gameState.equipment = [];
}

// Initialize equipment modal
function initEquipmentModal() {
  populateEquipmentGrid();
  populateEquipHeroTab();
  populateEnhanceTab();
}

// Populate equipment inventory
function populateEquipmentGrid() {
  const grid = document.getElementById('equipmentGrid');
  grid.innerHTML = '';
  
  if (gameState.equipment.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); grid-column: 1/-1;">No equipment yet. Purchase equipment from the shop!</p>';
    return;
  }
  
  gameState.equipment.forEach((item, index) => {
    const equipData = equipmentData.find(e => e.id === item.id);
    if (!equipData) return;
    
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.borderColor = rarityColors[equipData.rarity];
    
    let statsHTML = '';
    for (let stat in equipData.stats) {
      statsHTML += `<div class="stat-row"><span>${stat}:</span><span>+${equipData.stats[stat]}</span></div>`;
    }
    
    card.innerHTML = `
      <div class="item-card-header">
        <div class="item-icon">${equipData.icon}</div>
        <div class="item-info">
          <h3>${equipData.name}</h3>
          <p style="color: ${rarityColors[equipData.rarity]}">${equipData.rarity} ${equipData.slot}</p>
        </div>
      </div>
      <div class="item-stats">${statsHTML}</div>
      <div style="display: flex; gap: 5px; margin-top: 10px;">
        ${item.equipped ? 
          '<span class="status status--success" style="flex: 1; text-align: center;">Equipped</span>' :
          `<button class="btn btn--primary" style="flex: 1; padding: 8px;" onclick="quickEquipItem(${index})">Equip</button>`
        }
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// Populate equip hero tab
function populateEquipHeroTab() {
  const content = document.getElementById('equipHeroContent');
  
  if (gameState.heroes.length === 0) {
    content.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No heroes available. Recruit heroes first!</p>';
    return;
  }
  
  content.innerHTML = '<div class="heroes-equipment-list"></div>';
  const list = content.querySelector('.heroes-equipment-list');
  
  gameState.heroes.forEach((hero, heroIndex) => {
    const heroData = heroesData.find(h => h.id === hero.id);
    if (!heroData) return;
    
    const heroCard = document.createElement('div');
    heroCard.className = 'list-item';
    heroCard.style.flexDirection = 'column';
    heroCard.style.alignItems = 'flex-start';
    
    let equippedHTML = '';
    const slots = ['Weapon', 'Helmet', 'Armor', 'Boots', 'Ring', 'Amulet'];
    
    slots.forEach(slot => {
      const equipped = gameState.equipment.find(e => e.equipped === hero.id && equipmentData.find(ed => ed.id === e.id)?.slot === slot);
      if (equipped) {
        const equipData = equipmentData.find(ed => ed.id === equipped.id);
        equippedHTML += `<div style="padding: 5px; background: var(--bg-light); border-radius: 4px; border: 1px solid ${rarityColors[equipData.rarity]};">${equipData.icon} ${equipData.name}</div>`;
      } else {
        equippedHTML += `<div style="padding: 5px; background: var(--bg-dark); border-radius: 4px; color: var(--text-muted);">Empty ${slot}</div>`;
      }
    });
    
    heroCard.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; width: 100%; margin-bottom: 10px;">
        <div style="font-size: 36px;">${heroData.icon}</div>
        <div style="flex: 1;">
          <div class="list-item-title">${heroData.name}</div>
          <div class="list-item-desc">${heroData.class} | Level ${hero.level}</div>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; width: 100%;">
        ${equippedHTML}
      </div>
    `;
    
    list.appendChild(heroCard);
  });
}

// Populate enhance tab
function populateEnhanceTab() {
  const content = document.getElementById('enhanceContent');
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h3>Equipment Enhancement</h3>
      <p style="color: var(--text-secondary); margin: 15px 0;">Enhance your equipment to increase stats!</p>
      <p style="color: var(--color-warning);">Enhancement system coming soon!</p>
    </div>
  `;
}

// Quick equip item to first available hero
function quickEquipItem(itemIndex) {
  const item = gameState.equipment[itemIndex];
  const equipData = equipmentData.find(e => e.id === item.id);
  
  if (gameState.heroes.length === 0) {
    showNotification('No heroes available!', 'error');
    return;
  }
  
  // Find first hero without this slot equipped
  for (let hero of gameState.heroes) {
    const hasSlotEquipped = gameState.equipment.some(e => 
      e.equipped === hero.id && 
      equipmentData.find(ed => ed.id === e.id)?.slot === equipData.slot
    );
    
    if (!hasSlotEquipped) {
      item.equipped = hero.id;
      showNotification(`Equipped ${equipData.name} on ${heroesData.find(h => h.id === hero.id)?.name}!`);
      populateEquipmentGrid();
      populateEquipHeroTab();
      return;
    }
  }
  
  showNotification('All heroes already have this equipment slot filled!', 'warning');
}

// Purchase equipment
function purchaseEquipment(equipId) {
  const equipData = equipmentData.find(e => e.id === equipId);
  if (!equipData) return;
  
  if (!hasEnoughResources(equipData.cost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }
  
  deductResources(equipData.cost);
  
  gameState.equipment.push({
    id: equipId,
    level: 1,
    equipped: null
  });
  
  gameState.stats.equipmentCollected++;
  addXP(20);
  
  showNotification(`Purchased ${equipData.name}!`);
  populateEquipmentGrid();
}

// Calculate total equipment bonuses for a hero
function calculateEquipmentBonuses(heroId) {
  const bonuses = { attack: 0, defense: 0, hp: 0, speed: 0, leadership: 0 };
  
  gameState.equipment.forEach(item => {
    if (item.equipped === heroId) {
      const equipData = equipmentData.find(e => e.id === item.id);
      if (equipData) {
        for (let stat in equipData.stats) {
          if (bonuses[stat] !== undefined) {
            bonuses[stat] += equipData.stats[stat];
          }
        }
      }
    }
  });
  
  return bonuses;
}