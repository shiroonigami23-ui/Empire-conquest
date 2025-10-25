// ===================================
// SHOP SYSTEM
// ===================================

const shopItems = {
  resources: [
    { id: 'gold_small', name: 'Small Gold Pack', icon: '💰', cost: { gems: 10 }, reward: { gold: 5000 } },
    { id: 'gold_medium', name: 'Medium Gold Pack', icon: '💰', cost: { gems: 25 }, reward: { gold: 15000 } },
    { id: 'gold_large', name: 'Large Gold Pack', icon: '💰', cost: { gems: 50 }, reward: { gold: 35000 } },
    { id: 'resources_bundle', name: 'Resource Bundle', icon: '🎁', cost: { gems: 40 }, reward: { food: 10000, wood: 10000, stone: 10000, iron: 5000 } },
    { id: 'premium_pack', name: 'Premium Resource Pack', icon: '🎉', cost: { gems: 100 }, reward: { gold: 50000, food: 20000, wood: 20000, stone: 20000, iron: 10000, mana: 100 } }
  ],
  heroes: [
    { id: 'hero_summon_basic', name: 'Basic Hero Summon', icon: '✨', cost: { gems: 50 }, description: 'Summon a random Common or Rare hero' },
    { id: 'hero_summon_premium', name: 'Premium Hero Summon', icon: '🌟', cost: { gems: 100 }, description: 'Summon a random Rare or Epic hero' },
    { id: 'hero_summon_legendary', name: 'Legendary Hero Summon', icon: '🔥', cost: { gems: 200 }, description: 'Guaranteed Epic or Legendary hero' }
  ],
  speedups: [
    { id: 'speedup_1h', name: '1 Hour Speed-Up', icon: '⏱️', cost: { gems: 5 }, speedup: 3600 },
    { id: 'speedup_3h', name: '3 Hour Speed-Up', icon: '⏱️', cost: { gems: 12 }, speedup: 10800 },
    { id: 'speedup_8h', name: '8 Hour Speed-Up', icon: '⏱️', cost: { gems: 25 }, speedup: 28800 },
    { id: 'speedup_24h', name: '24 Hour Speed-Up', icon: '⏱️', cost: { gems: 50 }, speedup: 86400 }
  ],
  vip: [
    { id: 'vip_starter', name: 'VIP Starter Pack', icon: '🎁', cost: { gems: 50 }, reward: { vip_points: 100, gold: 10000 } },
    { id: 'vip_premium', name: 'VIP Premium Pack', icon: '💎', cost: { gems: 150 }, reward: { vip_points: 500, gold: 30000, gems: 20 } },
    { id: 'vip_ultimate', name: 'VIP Ultimate Pack', icon: '👑', cost: { gems: 300 }, reward: { vip_points: 1000, gold: 100000, gems: 50 } }
  ]
};

// Initialize shop modal
function initShopModal() {
  populateResourceShop();
  populateHeroShop();
  populateSpeedUpShop();
  populateVIPShop();
}

// Populate resource shop
function populateResourceShop() {
  const content = document.getElementById('resourceShopContent');
  let html = '<div class="buildings-grid">';
  
  shopItems.resources.forEach(item => {
    const canPurchase = hasEnoughResources(item.cost);
    
    let costHTML = '';
    for (let resource in item.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${item.cost[resource]}</span></div>`;
    }
    
    let rewardHTML = '';
    for (let resource in item.reward) {
      const icon = getResourceIcon(resource);
      rewardHTML += `<div style="font-size: 13px; color: var(--text-secondary); margin: 3px 0;">${icon} +${item.reward[resource]}</div>`;
    }
    
    html += `
      <div class="item-card">
        <div class="item-card-header">
          <div class="item-icon">${item.icon}</div>
          <div class="item-info">
            <h3>${item.name}</h3>
          </div>
        </div>
        <div style="margin: 10px 0;">
          <strong style="font-size: 12px;">Rewards:</strong>
          ${rewardHTML}
        </div>
        <div class="item-cost">${costHTML}</div>
        <button class="btn btn--primary" onclick="purchaseShopItem('resources', '${item.id}')" ${!canPurchase ? 'disabled' : ''}>
          Purchase
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

// Populate hero shop
function populateHeroShop() {
  const content = document.getElementById('heroShopContent');
  let html = '<div class="buildings-grid">';
  
  shopItems.heroes.forEach(item => {
    const canPurchase = hasEnoughResources(item.cost);
    
    let costHTML = '';
    for (let resource in item.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${item.cost[resource]}</span></div>`;
    }
    
    html += `
      <div class="item-card">
        <div class="item-card-header">
          <div class="item-icon">${item.icon}</div>
          <div class="item-info">
            <h3>${item.name}</h3>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 10px 0;">${item.description}</p>
        <div class="item-cost">${costHTML}</div>
        <button class="btn btn--primary" onclick="purchaseShopItem('heroes', '${item.id}')" ${!canPurchase ? 'disabled' : ''}>
          Summon
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

// Populate speed-up shop
function populateSpeedUpShop() {
  const content = document.getElementById('speedUpShopContent');
  let html = '<div class="buildings-grid">';
  
  shopItems.speedups.forEach(item => {
    const canPurchase = hasEnoughResources(item.cost);
    
    let costHTML = '';
    for (let resource in item.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${item.cost[resource]}</span></div>`;
    }
    
    html += `
      <div class="item-card">
        <div class="item-card-header">
          <div class="item-icon">${item.icon}</div>
          <div class="item-info">
            <h3>${item.name}</h3>
          </div>
        </div>
        <p style="font-size: 12px; color: var(--text-secondary); margin: 10px 0;">Speed up any action by ${item.speedup / 3600} hours</p>
        <div class="item-cost">${costHTML}</div>
        <button class="btn btn--primary" onclick="purchaseShopItem('speedups', '${item.id}')" ${!canPurchase ? 'disabled' : ''}>
          Purchase
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

// Populate VIP shop
function populateVIPShop() {
  const content = document.getElementById('vipShopContent');
  let html = '<div class="buildings-grid">';
  
  shopItems.vip.forEach(item => {
    const canPurchase = hasEnoughResources(item.cost);
    
    let costHTML = '';
    for (let resource in item.cost) {
      const icon = getResourceIcon(resource);
      costHTML += `<div class="cost-item">${icon} <span>${item.cost[resource]}</span></div>`;
    }
    
    let rewardHTML = '';
    for (let key in item.reward) {
      if (key === 'vip_points') {
        rewardHTML += `<div style="font-size: 13px; color: var(--text-secondary); margin: 3px 0;">👑 +${item.reward[key]} VIP Points</div>`;
      } else {
        const icon = getResourceIcon(key);
        rewardHTML += `<div style="font-size: 13px; color: var(--text-secondary); margin: 3px 0;">${icon} +${item.reward[key]}</div>`;
      }
    }
    
    html += `
      <div class="item-card">
        <div class="item-card-header">
          <div class="item-icon">${item.icon}</div>
          <div class="item-info">
            <h3>${item.name}</h3>
          </div>
        </div>
        <div style="margin: 10px 0;">
          <strong style="font-size: 12px;">Rewards:</strong>
          ${rewardHTML}
        </div>
        <div class="item-cost">${costHTML}</div>
        <button class="btn btn--primary" onclick="purchaseShopItem('vip', '${item.id}')" ${!canPurchase ? 'disabled' : ''}>
          Purchase
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

// Purchase shop item
function purchaseShopItem(category, itemId) {
  const item = shopItems[category].find(i => i.id === itemId);
  if (!item) return;
  
  if (!hasEnoughResources(item.cost)) {
    showNotification('Not enough resources!', 'error');
    return;
  }
  
  deductResources(item.cost);
  
  if (category === 'resources') {
    addResources(item.reward);
    showNotification(`Purchased ${item.name}!`);
  } else if (category === 'heroes') {
    // Summon random hero
    const availableHeroes = heroesData.filter(h => !gameState.heroes.some(gh => gh.id === h.id));
    if (availableHeroes.length > 0) {
      const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
      gameState.heroes.push({
        id: randomHero.id,
        level: 1,
        xp: 0,
        maxXp: 100
      });
      showNotification(`Summoned ${randomHero.name}!`);
    } else {
      addResources({ gold: 5000 });
      showNotification('All heroes already recruited! +5000 Gold compensation');
    }
  } else if (category === 'speedups') {
    showNotification(`Purchased ${item.name}! (Speed-ups stored for later use)`);
  } else if (category === 'vip') {
    if (item.reward.vip_points) {
      gameState.vip.points += item.reward.vip_points;
      // Check for level up
      while (gameState.vip.level < vipBenefits.length - 1) {
        const nextLevel = vipBenefits[gameState.vip.level + 1];
        if (gameState.vip.points >= nextLevel.pointsRequired) {
          gameState.vip.level++;
        } else {
          break;
        }
      }
    }
    const otherRewards = { ...item.reward };
    delete otherRewards.vip_points;
    if (Object.keys(otherRewards).length > 0) {
      addResources(otherRewards);
    }
    showNotification(`Purchased ${item.name}!`);
  }
  
  // Refresh shop
  initShopModal();
}