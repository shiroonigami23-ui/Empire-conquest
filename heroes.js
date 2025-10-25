// ===================================
// HERO SYSTEM
// ===================================

// Heroes data from JSON
const heroesData = [
  {
    id: 'warrior_king',
    name: 'Warrior King',
    icon: '🤴',
    class: 'Warrior',
    description: 'A powerful melee fighter with high defense',
    cost: { gold: 1000 },
    stats: { hp: 500, attack: 80, defense: 60, leadership: 50 },
    skills: ['Battle Cry', 'Shield Wall', 'Charge']
  },
  {
    id: 'archmage',
    name: 'Archmage',
    icon: '🧙',
    class: 'Mage',
    description: 'Master of magical arts with devastating spells',
    cost: { gold: 1200 },
    stats: { hp: 350, attack: 100, defense: 30, leadership: 60 },
    skills: ['Fireball', 'Ice Storm', 'Arcane Shield']
  },
  {
    id: 'ranger_captain',
    name: 'Ranger Captain',
    icon: '🎯',
    class: 'Ranger',
    description: 'Expert archer with precision strikes',
    cost: { gold: 900 },
    stats: { hp: 400, attack: 90, defense: 40, leadership: 55 },
    skills: ['Multi-Shot', 'Eagle Eye', 'Camouflage']
  },
  {
    id: 'paladin',
    name: 'Holy Paladin',
    icon: '⚔️',
    class: 'Paladin',
    description: 'Divine warrior with healing abilities',
    cost: { gold: 1100 },
    stats: { hp: 480, attack: 70, defense: 70, leadership: 65 },
    skills: ['Divine Light', 'Holy Strike', 'Blessing']
  },
  {
    id: 'assassin',
    name: 'Shadow Assassin',
    icon: '🔪',
    class: 'Assassin',
    description: 'Swift and deadly with critical strikes',
    cost: { gold: 1000 },
    stats: { hp: 320, attack: 110, defense: 25, leadership: 45 },
    skills: ['Backstab', 'Smoke Bomb', 'Poison Dagger']
  },
  {
    id: 'engineer',
    name: 'Master Engineer',
    icon: '🔧',
    class: 'Engineer',
    description: 'Siege expert with mechanical prowess',
    cost: { gold: 950 },
    stats: { hp: 380, attack: 85, defense: 50, leadership: 58 },
    skills: ['Deploy Turret', 'Repair', 'Explosive Trap']
  }
];

// Initialize heroes array if not exists
if (!gameState.heroes) {
  gameState.heroes = [];
}

// Initialize heroes modal
function initHeroesModal() {
  populateHeroesGrid();
  updateMyHeroesList();
}

// Populate heroes recruitment grid
function populateHeroesGrid() {
  const heroesGrid = document.getElementById('heroesGrid');
  heroesGrid.innerHTML = '';

  heroesData.forEach(hero => {
    const isRecruited = gameState.heroes.some(h => h.id === hero.id);
    const canRecruit = !isRecruited && hasEnoughResources(hero.cost);
    
    let costHTML = '';
    for (let resource in hero.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${hero.cost[resource]}</span></div>`;
    }

    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <div class="item-icon">${hero.icon}</div>
        <div class="item-info">
          <h3>${hero.name}</h3>
          <p>${hero.class}</p>
        </div>
      </div>
      <p style="font-size: 12px; color: var(--text-secondary); margin: 10px 0;">${hero.description}</p>
      <div class="item-stats">
        <div class="stat-row">
          <span>❤️ HP:</span>
          <span>${hero.stats.hp}</span>
        </div>
        <div class="stat-row">
          <span>⚔️ Attack:</span>
          <span>${hero.stats.attack}</span>
        </div>
        <div class="stat-row">
          <span>🛡️ Defense:</span>
          <span>${hero.stats.defense}</span>
        </div>
        <div class="stat-row">
          <span>🏆 Leadership:</span>
          <span>${hero.stats.leadership}</span>
        </div>
      </div>
      <div style="margin: 10px 0;">
        <strong style="font-size: 12px;">Skills:</strong>
        <div style="font-size: 11px; color: var(--text-secondary);">${hero.skills.join(', ')}</div>
      </div>
      <div class="item-cost">${costHTML}</div>
      ${isRecruited ? 
        '<button class="btn btn--success" disabled>Recruited</button>' :
        `<button class="btn btn--primary" 
                onclick="recruitHero('${hero.id}')" 
                ${!canRecruit ? 'disabled' : ''}>
          Recruit
        </button>`
      }
    `;

    heroesGrid.appendChild(card);
  });
}

// Recruit a hero
function recruitHero(heroId) {
  const heroData = heroesData.find(h => h.id === heroId);
  
  if (!heroData || gameState.heroes.some(h => h.id === heroId)) {
    return;
  }
  
  if (!hasEnoughResources(heroData.cost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }

  deductResources(heroData.cost);
  
  const newHero = {
    id: heroId,
    level: 1,
    xp: 0,
    maxXp: 100
  };
  
  gameState.heroes.push(newHero);
  
  addXP(50);
  showNotification(`${heroData.name} recruited!`);
  populateHeroesGrid();
  updateMyHeroesList();
}

// Update my heroes list
function updateMyHeroesList() {
  const myHeroesList = document.getElementById('myHeroesList');
  myHeroesList.innerHTML = '';

  if (gameState.heroes.length === 0) {
    myHeroesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No heroes recruited yet. Recruit heroes to lead your armies!</p>';
    return;
  }

  gameState.heroes.forEach(hero => {
    const heroData = heroesData.find(h => h.id === hero.id);
    
    if (!heroData) return;
    
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.style.flexDirection = 'column';
    listItem.style.alignItems = 'flex-start';
    
    listItem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; width: 100%; margin-bottom: 10px;">
        <div style="font-size: 48px;">${heroData.icon}</div>
        <div style="flex: 1;">
          <div class="list-item-title">${heroData.name}</div>
          <div class="list-item-desc">${heroData.class} | Level ${hero.level}</div>
        </div>
        <button class="btn btn--success" onclick="levelUpHero('${hero.id}')">
          Level Up
        </button>
      </div>
      <div class="progress-bar" style="width: 100%;">
        <div class="progress-fill" style="width: ${(hero.xp / hero.maxXp) * 100}%;">
          ${hero.xp}/${hero.maxXp} XP
        </div>
      </div>
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; margin-top: 10px;">
        <div style="text-align: center;">
          <div style="font-size: 12px; color: var(--text-secondary);">HP</div>
          <div style="font-weight: bold;">${heroData.stats.hp + (hero.level - 1) * 20}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: var(--text-secondary);">Attack</div>
          <div style="font-weight: bold;">${heroData.stats.attack + (hero.level - 1) * 5}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: var(--text-secondary);">Defense</div>
          <div style="font-weight: bold;">${heroData.stats.defense + (hero.level - 1) * 3}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: 12px; color: var(--text-secondary);">Leadership</div>
          <div style="font-weight: bold;">${heroData.stats.leadership + (hero.level - 1) * 2}</div>
        </div>
      </div>
    `;

    myHeroesList.appendChild(listItem);
  });
}

// Level up hero
function levelUpHero(heroId) {
  const hero = gameState.heroes.find(h => h.id === heroId);
  const heroData = heroesData.find(h => h.id === heroId);
  
  if (!hero || !heroData) return;
  
  const levelUpCost = {
    gold: hero.level * 200
  };
  
  if (!hasEnoughResources(levelUpCost)) {
    showNotification('Not enough gold to level up!', 'error');
    return;
  }
  
  deductResources(levelUpCost);
  hero.level++;
  hero.xp = 0;
  hero.maxXp = Math.floor(hero.maxXp * 1.5);
  
  showNotification(`${heroData.name} is now level ${hero.level}!`);
  updateMyHeroesList();
}

// Calculate total hero power
function calculateHeroPower() {
  let totalPower = 0;
  
  gameState.heroes.forEach(hero => {
    const heroData = heroesData.find(h => h.id === hero.id);
    if (heroData) {
      const heroPower = (
        (heroData.stats.hp + (hero.level - 1) * 20) +
        (heroData.stats.attack + (hero.level - 1) * 5) * 2 +
        (heroData.stats.defense + (hero.level - 1) * 3) +
        (heroData.stats.leadership + (hero.level - 1) * 2)
      );
      totalPower += heroPower;
    }
  });
  
  return totalPower;
}