// ===================================
// ACHIEVEMENTS SYSTEM
// ===================================

const achievementsData = [
  // Building Achievements
  { id: 'builder_1', name: 'Apprentice Builder', category: 'Building', icon: '🏗️', description: 'Construct 5 buildings', progress: 0, goal: 5, reward: { gold: 1000, xp: 50 }, unlocked: false },
  { id: 'builder_2', name: 'Master Builder', category: 'Building', icon: '🏗️', description: 'Construct 20 buildings', progress: 0, goal: 20, reward: { gold: 5000, gems: 20, xp: 150 }, unlocked: false },
  { id: 'builder_3', name: 'Legendary Architect', category: 'Building', icon: '🏗️', description: 'Construct 50 buildings', progress: 0, goal: 50, reward: { gold: 20000, gems: 100, xp: 500 }, unlocked: false },
  
  // Combat Achievements
  { id: 'warrior_1', name: 'Novice Warrior', category: 'Combat', icon: '⚔️', description: 'Win 10 battles', progress: 0, goal: 10, reward: { gold: 2000, honor: 100, xp: 80 }, unlocked: false },
  { id: 'warrior_2', name: 'Veteran Commander', category: 'Combat', icon: '⚔️', description: 'Win 50 battles', progress: 0, goal: 50, reward: { gold: 10000, honor: 500, xp: 300 }, unlocked: false },
  { id: 'warrior_3', name: 'Legendary Conqueror', category: 'Combat', icon: '⚔️', description: 'Win 200 battles', progress: 0, goal: 200, reward: { gold: 50000, gems: 200, honor: 2000, xp: 1000 }, unlocked: false },
  
  // Army Achievements
  { id: 'general_1', name: 'Squad Leader', category: 'Army', icon: '👥', description: 'Train 100 units', progress: 0, goal: 100, reward: { gold: 3000, xp: 100 }, unlocked: false },
  { id: 'general_2', name: 'Army Commander', category: 'Army', icon: '👥', description: 'Train 500 units', progress: 0, goal: 500, reward: { gold: 15000, gems: 50, xp: 400 }, unlocked: false },
  { id: 'general_3', name: 'Supreme Warlord', category: 'Army', icon: '👥', description: 'Train 2000 units', progress: 0, goal: 2000, reward: { gold: 75000, gems: 300, xp: 1500 }, unlocked: false },
  
  // Research Achievements
  { id: 'scholar_1', name: 'Junior Researcher', category: 'Research', icon: '📚', description: 'Complete 5 research', progress: 0, goal: 5, reward: { gold: 2500, xp: 120 }, unlocked: false },
  { id: 'scholar_2', name: 'Senior Scientist', category: 'Research', icon: '📚', description: 'Complete 20 research', progress: 0, goal: 20, reward: { gold: 12000, gems: 60, xp: 450 }, unlocked: false },
  { id: 'scholar_3', name: 'Grand Sage', category: 'Research', icon: '📚', description: 'Complete 50 research', progress: 0, goal: 50, reward: { gold: 60000, gems: 250, xp: 1200 }, unlocked: false },
  
  // Hero Achievements
  { id: 'hero_1', name: 'Hero Collector', category: 'Heroes', icon: '🦸', description: 'Recruit 5 heroes', progress: 0, goal: 5, reward: { gold: 5000, xp: 200 }, unlocked: false },
  { id: 'hero_2', name: 'Hero Master', category: 'Heroes', icon: '🦸', description: 'Recruit 15 heroes', progress: 0, goal: 15, reward: { gold: 25000, gems: 150, xp: 800 }, unlocked: false },
  { id: 'hero_3', name: 'Hero Legend', category: 'Heroes', icon: '🦸', description: 'Recruit all 50 heroes', progress: 0, goal: 50, reward: { gold: 150000, gems: 1000, xp: 5000 }, unlocked: false },
  
  // Resource Achievements
  { id: 'wealthy_1', name: 'Merchant', category: 'Resources', icon: '💰', description: 'Accumulate 50,000 gold', progress: 0, goal: 50000, reward: { gems: 30, xp: 150 }, unlocked: false },
  { id: 'wealthy_2', name: 'Tycoon', category: 'Resources', icon: '💰', description: 'Accumulate 500,000 gold', progress: 0, goal: 500000, reward: { gems: 150, xp: 600 }, unlocked: false },
  { id: 'wealthy_3', name: 'Empire Treasurer', category: 'Resources', icon: '💰', description: 'Accumulate 5,000,000 gold', progress: 0, goal: 5000000, reward: { gems: 1000, xp: 3000 }, unlocked: false },
  
  // Special Achievements
  { id: 'vip_5', name: 'VIP Elite', category: 'Special', icon: '👑', description: 'Reach VIP Level 5', progress: 0, goal: 5, reward: { gold: 20000, gems: 100, xp: 500 }, unlocked: false },
  { id: 'vip_10', name: 'VIP Legend', category: 'Special', icon: '👑', description: 'Reach VIP Level 10', progress: 0, goal: 10, reward: { gold: 100000, gems: 500, xp: 2000 }, unlocked: false },
  { id: 'alliance_member', name: 'Team Player', category: 'Special', icon: '🏛️', description: 'Join an alliance', progress: 0, goal: 1, reward: { gold: 5000, guild_coins: 100, xp: 200 }, unlocked: false },
  { id: 'equipment_10', name: 'Gear Collector', category: 'Special', icon: '⚔️', description: 'Collect 10 equipment', progress: 0, goal: 10, reward: { gold: 8000, gems: 40, xp: 300 }, unlocked: false },
  { id: 'pet_5', name: 'Pet Trainer', category: 'Special', icon: '🐉', description: 'Collect 5 pets', progress: 0, goal: 5, reward: { gold: 10000, gems: 50, xp: 400 }, unlocked: false }
];

// Initialize achievements
if (!gameState.achievements) {
  gameState.achievements = [];
}

// Initialize achievements modal
function initAchievementsModal() {
  updateAchievementsProgress();
  populateAchievements();
}

// Update achievements progress
function updateAchievementsProgress() {
  achievementsData.forEach(achievement => {
    switch (achievement.id) {
      case 'builder_1':
      case 'builder_2':
      case 'builder_3':
        achievement.progress = gameState.stats.buildingsConstructed;
        break;
      case 'warrior_1':
      case 'warrior_2':
      case 'warrior_3':
        achievement.progress = gameState.stats.battlesWon;
        break;
      case 'general_1':
      case 'general_2':
      case 'general_3':
        achievement.progress = gameState.stats.unitsTrained;
        break;
      case 'scholar_1':
      case 'scholar_2':
      case 'scholar_3':
        achievement.progress = gameState.stats.researchCompleted;
        break;
      case 'hero_1':
      case 'hero_2':
      case 'hero_3':
        achievement.progress = gameState.heroes.length;
        break;
      case 'wealthy_1':
      case 'wealthy_2':
      case 'wealthy_3':
        achievement.progress = Math.floor(gameState.resources.gold);
        break;
      case 'vip_5':
      case 'vip_10':
        achievement.progress = gameState.vip.level;
        break;
      case 'alliance_member':
        achievement.progress = gameState.alliance ? 1 : 0;
        break;
      case 'equipment_10':
        achievement.progress = gameState.equipment.length;
        break;
      case 'pet_5':
        achievement.progress = gameState.pets.length;
        break;
    }
    
    if (achievement.progress >= achievement.goal && !achievement.unlocked) {
      achievement.unlocked = true;
      if (!gameState.achievements.includes(achievement.id)) {
        gameState.achievements.push(achievement.id);
        gameState.stats.achievementsUnlocked++;
        // Auto-claim rewards
        addResources(achievement.reward);
        if (achievement.reward.xp) addXP(achievement.reward.xp);
        showNotification(`Achievement Unlocked: ${achievement.name}!`);
      }
    }
  });
}

// Populate achievements list
function populateAchievements() {
  const content = document.getElementById('achievementsContent');
  
  const categories = ['Building', 'Combat', 'Army', 'Research', 'Heroes', 'Resources', 'Special'];
  
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h3>Achievements</h3>
      <p style="color: var(--text-secondary);">Unlocked: ${gameState.stats.achievementsUnlocked} / ${achievementsData.length}</p>
      <div class="progress-bar" style="max-width: 500px; margin: 15px auto;">
        <div class="progress-fill" style="width: ${(gameState.stats.achievementsUnlocked / achievementsData.length) * 100}%;">
          ${Math.floor((gameState.stats.achievementsUnlocked / achievementsData.length) * 100)}%
        </div>
      </div>
    </div>
  `;
  
  categories.forEach(category => {
    const categoryAchievements = achievementsData.filter(a => a.category === category);
    
    html += `<h3 style="margin: 25px 0 15px 0; color: var(--color-secondary);">${category}</h3>`;
    html += '<div style="display: grid; gap: 10px;">';
    
    categoryAchievements.forEach(achievement => {
      let rewardHTML = '';
      for (let resource in achievement.reward) {
        if (resource === 'xp') continue;
        const icon = getResourceIcon(resource);
        rewardHTML += `${icon} ${achievement.reward[resource]} `;
      }
      if (achievement.reward.xp) {
        rewardHTML += `⭐ ${achievement.reward.xp} XP`;
      }
      
      html += `
        <div class="list-item" style="${achievement.unlocked ? 'border-color: var(--color-success);' : ''}">
          <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
            <div style="font-size: 36px; opacity: ${achievement.unlocked ? '1' : '0.5'};">${achievement.icon}</div>
            <div style="flex: 1;">
              <div class="list-item-title">${achievement.name}</div>
              <div class="list-item-desc">${achievement.description}</div>
              <div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">Rewards: ${rewardHTML}</div>
              ${!achievement.unlocked ? `
                <div class="progress-bar" style="margin-top: 8px;">
                  <div class="progress-fill" style="width: ${Math.min(100, (achievement.progress / achievement.goal) * 100)}%;">
                    ${achievement.progress} / ${achievement.goal}
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
          ${achievement.unlocked ? 
            '<div style="text-align: center;"><div style="font-size: 32px; color: var(--color-success);">✓</div><div style="font-size: 11px; color: var(--color-success); font-weight: bold;">UNLOCKED</div></div>' :
            ''
          }
        </div>
      `;
    });
    
    html += '</div>';
  });
  
  content.innerHTML = html;
}