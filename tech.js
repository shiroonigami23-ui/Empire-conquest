// ===================================
// TECHNOLOGY RESEARCH SYSTEM
// ===================================

// Technology data from JSON
const technologiesData = [
  {
    id: 'improved_mining',
    name: 'Improved Mining',
    icon: '⛏️',
    description: 'Increase resource production by 10%',
    cost: { gold: 500, stone: 300 },
    research_time: 60,
    bonus: { type: 'production', value: 0.1 }
  },
  {
    id: 'advanced_weapons',
    name: 'Advanced Weapons',
    icon: '⚔️',
    description: 'Increase unit attack by 15%',
    cost: { gold: 800, iron: 400 },
    research_time: 90,
    bonus: { type: 'attack', value: 0.15 }
  },
  {
    id: 'fortification',
    name: 'Fortification',
    icon: '🏯',
    description: 'Increase building defense by 20%',
    cost: { gold: 700, stone: 500 },
    research_time: 75,
    bonus: { type: 'defense', value: 0.2 }
  },
  {
    id: 'rapid_training',
    name: 'Rapid Training',
    icon: '⏱️',
    description: 'Reduce unit training time by 25%',
    cost: { gold: 600, food: 400 },
    research_time: 60,
    bonus: { type: 'training_speed', value: 0.25 }
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: '🔧',
    description: 'Reduce building costs by 15%',
    cost: { gold: 1000, wood: 500, stone: 500 },
    research_time: 120,
    bonus: { type: 'building_cost', value: 0.15 }
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: '🚚',
    description: 'Increase army capacity by 20%',
    cost: { gold: 900, food: 600 },
    research_time: 90,
    bonus: { type: 'army_capacity', value: 0.2 }
  }
];

// Initialize researched technologies array if not exists
if (!gameState.researched) {
  gameState.researched = [];
}

if (!gameState.researching) {
  gameState.researching = null;
}

// Initialize research modal
function initResearchModal() {
  populateTechTree();
}

// Populate technology tree
function populateTechTree() {
  const techTree = document.getElementById('techTree');
  techTree.innerHTML = '';

  technologiesData.forEach(tech => {
    const isResearched = gameState.researched.includes(tech.id);
    const isResearching = gameState.researching === tech.id;
    const canResearch = !isResearched && !gameState.researching && hasEnoughResources(tech.cost);
    
    let costHTML = '';
    for (let resource in tech.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${tech.cost[resource]}</span></div>`;
    }

    const techItem = document.createElement('div');
    techItem.className = `tech-item ${isResearched ? 'researched' : ''} ${isResearching ? 'researching' : ''}`;
    techItem.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
        <div style="font-size: 48px;">${tech.icon}</div>
        <div>
          <h3 style="font-size: 18px; margin-bottom: 5px;">${tech.name}</h3>
          <p style="font-size: 12px; color: var(--text-secondary);">${tech.description}</p>
        </div>
      </div>
      <div class="item-cost" style="margin: 10px 0;">${costHTML}</div>
      <div style="font-size: 12px; color: var(--text-muted); margin: 10px 0;">
        ⏱️ Research Time: ${tech.research_time}s
      </div>
      ${isResearched ? 
        '<div style="color: var(--color-success); font-weight: bold; text-align: center;">✓ Researched</div>' :
        isResearching ?
        '<div style="color: var(--color-warning); font-weight: bold; text-align: center;">⏳ Researching...</div>' :
        `<button class="btn btn--primary" style="width: 100%;"
                onclick="startResearch('${tech.id}')" 
                ${!canResearch ? 'disabled' : ''}>
          Research
        </button>`
      }
    `;

    techTree.appendChild(techItem);
  });
}

// Start researching a technology
function startResearch(techId) {
  const tech = technologiesData.find(t => t.id === techId);
  
  if (!tech || gameState.researched.includes(techId) || gameState.researching) {
    return;
  }
  
  if (!hasEnoughResources(tech.cost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }

  deductResources(tech.cost);
  gameState.researching = techId;
  
  showNotification(`Researching ${tech.name}...`);
  populateTechTree();
  
  // Simulate research completion after research_time seconds
  setTimeout(() => {
    completeResearch(techId);
  }, tech.research_time * 1000);
}

// Complete research
function completeResearch(techId) {
  const tech = technologiesData.find(t => t.id === techId);
  
  if (!tech) return;
  
  gameState.researched.push(techId);
  gameState.researching = null;
  gameState.stats.researchCompleted++;
  
  addXP(30);
  showNotification(`${tech.name} research complete!`);
  populateTechTree();
}

// Get technology bonuses
function getTechBonus(type) {
  let bonus = 0;
  
  gameState.researched.forEach(techId => {
    const tech = technologiesData.find(t => t.id === techId);
    if (tech && tech.bonus.type === type) {
      bonus += tech.bonus.value;
    }
  });
  
  return bonus;
}