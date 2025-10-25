// ===================================
// VIP SYSTEM
// ===================================

const vipBenefits = [
  { level: 0, pointsRequired: 0, benefits: ['Basic access'] },
  { level: 1, pointsRequired: 100, benefits: ['Production +5%', 'Building speed +5%'] },
  { level: 2, pointsRequired: 300, benefits: ['Production +10%', 'Building speed +10%', 'Auto-collect resources'] },
  { level: 3, pointsRequired: 600, benefits: ['Production +15%', 'Building speed +15%', 'Extra builder queue'] },
  { level: 4, pointsRequired: 1000, benefits: ['Production +20%', 'Training speed +10%', 'Free daily speedup'] },
  { level: 5, pointsRequired: 1500, benefits: ['Production +25%', 'Training speed +15%', 'VIP shop access'] },
  { level: 6, pointsRequired: 2200, benefits: ['Production +30%', 'Research speed +10%', 'Exclusive avatar frames'] },
  { level: 7, pointsRequired: 3000, benefits: ['Production +35%', 'Research speed +15%', 'Double quest rewards'] },
  { level: 8, pointsRequired: 4000, benefits: ['Production +40%', 'All speeds +20%', 'Free hero summon daily'] },
  { level: 9, pointsRequired: 5500, benefits: ['Production +45%', 'All speeds +25%', 'VIP equipment access'] },
  { level: 10, pointsRequired: 7500, benefits: ['Production +50%', 'All speeds +30%', 'Legendary hero unlock'] },
  { level: 11, pointsRequired: 10000, benefits: ['Production +60%', 'All speeds +35%', 'Mythic equipment chance'] },
  { level: 12, pointsRequired: 13000, benefits: ['Production +70%', 'All speeds +40%', 'Double battle rewards'] },
  { level: 13, pointsRequired: 17000, benefits: ['Production +80%', 'All speeds +45%', 'Ultimate VIP skin'] },
  { level: 14, pointsRequired: 22000, benefits: ['Production +90%', 'All speeds +50%', 'Supreme commander title'] },
  { level: 15, pointsRequired: 30000, benefits: ['Production +100%', 'All speeds +60%', 'Emperor status', 'Exclusive world boss'] }
];

// Initialize VIP system
if (!gameState.vip) {
  gameState.vip = { level: 0, points: 0, pointsToNext: 100 };
}

// Initialize VIP modal
function initVIPModal() {
  const body = document.getElementById('vipModalBody');
  
  const currentVIP = vipBenefits[gameState.vip.level];
  const nextVIP = vipBenefits[gameState.vip.level + 1];
  
  let vipHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 72px; margin-bottom: 15px;">👑</div>
      <h2 style="font-size: 32px; color: var(--color-secondary);">VIP Level ${gameState.vip.level}</h2>
      <p style="color: var(--text-secondary);">VIP Points: ${gameState.vip.points}</p>
      ${nextVIP ? `
        <div class="progress-bar" style="max-width: 400px; margin: 15px auto;">
          <div class="progress-fill" style="width: ${(gameState.vip.points / nextVIP.pointsRequired) * 100}%;">
            ${gameState.vip.points} / ${nextVIP.pointsRequired}
          </div>
        </div>
        <p style="color: var(--text-muted); font-size: 12px;">Next level: ${nextVIP.pointsRequired - gameState.vip.points} points needed</p>
      ` : '<p style="color: var(--color-success); font-size: 18px; margin-top: 15px;">✨ MAX VIP LEVEL REACHED! ✨</p>'}
    </div>
    
    <div style="background: var(--bg-light); padding: 20px; border-radius: var(--radius-lg); margin-bottom: 20px;">
      <h3 style="margin-bottom: 15px;">Current Benefits</h3>
      <div style="display: grid; gap: 8px;">
        ${currentVIP.benefits.map(b => `<div style="padding: 8px; background: var(--bg-medium); border-radius: var(--radius-md); border-left: 3px solid var(--color-secondary);">✓ ${b}</div>`).join('')}
      </div>
    </div>
  `;
  
  // Show all VIP levels
  vipHTML += '<h3 style="margin-bottom: 15px;">All VIP Levels</h3><div style="display: grid; gap: 15px;">';
  
  vipBenefits.forEach((vip, index) => {
    const isUnlocked = gameState.vip.level >= index;
    vipHTML += `
      <div class="tech-item ${isUnlocked ? 'researched' : ''}" style="${isUnlocked ? '' : 'opacity: 0.6;'}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="font-size: 18px;">VIP ${index}</h4>
          <span style="color: var(--color-secondary); font-weight: bold;">${vip.pointsRequired} points</span>
        </div>
        <div style="display: grid; gap: 5px;">
          ${vip.benefits.map(b => `<div style="font-size: 12px; color: var(--text-secondary);">• ${b}</div>`).join('')}
        </div>
      </div>
    `;
  });
  
  vipHTML += '</div>';
  
  vipHTML += `
    <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, var(--color-primary), var(--color-secondary)); border-radius: var(--radius-lg); text-align: center;">
      <h3 style="color: white; margin-bottom: 15px;">Purchase VIP Points</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <button class="btn btn--primary" onclick="purchaseVIPPoints(100, { gems: 10 })" style="background: white; color: var(--color-primary);">
          <div>100 VIP Points</div>
          <div style="font-size: 12px;">💎 10 Gems</div>
        </button>
        <button class="btn btn--primary" onclick="purchaseVIPPoints(500, { gems: 45 })" style="background: white; color: var(--color-primary);">
          <div>500 VIP Points</div>
          <div style="font-size: 12px;">💎 45 Gems</div>
        </button>
        <button class="btn btn--primary" onclick="purchaseVIPPoints(1000, { gems: 80 })" style="background: white; color: var(--color-primary);">
          <div>1000 VIP Points</div>
          <div style="font-size: 12px;">💎 80 Gems</div>
        </button>
      </div>
    </div>
  `;
  
  body.innerHTML = vipHTML;
  
  // Update VIP badge in top nav
  document.getElementById('vipLevelBadge').textContent = gameState.vip.level;
}

// Purchase VIP points
function purchaseVIPPoints(points, cost) {
  if (!hasEnoughResources(cost)) {
    showNotification('Not enough gems!', 'error');
    return;
  }
  
  deductResources(cost);
  gameState.vip.points += points;
  
  // Check for level up
  let leveledUp = false;
  while (gameState.vip.level < vipBenefits.length - 1) {
    const nextLevel = vipBenefits[gameState.vip.level + 1];
    if (gameState.vip.points >= nextLevel.pointsRequired) {
      gameState.vip.level++;
      leveledUp = true;
    } else {
      break;
    }
  }
  
  if (leveledUp) {
    showNotification(`VIP Level Up! You are now VIP ${gameState.vip.level}!`);
  } else {
    showNotification(`Added ${points} VIP points!`);
  }
  
  initVIPModal();
  document.getElementById('vipLevelBadge').textContent = gameState.vip.level;
}

// Get VIP production bonus multiplier
function getVIPProductionBonus() {
  const vip = vipBenefits[gameState.vip.level];
  // Extract percentage from benefits
  const prodBenefit = vip.benefits.find(b => b.includes('Production'));
  if (prodBenefit) {
    const match = prodBenefit.match(/(\d+)%/);
    if (match) return parseFloat(match[1]) / 100;
  }
  return 0;
}

// Get VIP speed bonus multiplier
function getVIPSpeedBonus() {
  const vip = vipBenefits[gameState.vip.level];
  const speedBenefit = vip.benefits.find(b => b.includes('speed') || b.includes('speeds'));
  if (speedBenefit) {
    const match = speedBenefit.match(/(\d+)%/);
    if (match) return parseFloat(match[1]) / 100;
  }
  return 0;
}