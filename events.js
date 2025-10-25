// ===================================
// EVENTS & DAILY REWARDS SYSTEM
// ===================================

const dailyRewardsData = [
  { day: 1, rewards: { gold: 500, food: 200 } },
  { day: 2, rewards: { gold: 600, wood: 200 } },
  { day: 3, rewards: { gold: 700, stone: 200 } },
  { day: 4, rewards: { gold: 800, iron: 100 } },
  { day: 5, rewards: { gold: 1000, gems: 10 } },
  { day: 6, rewards: { gold: 1200, mana: 20 } },
  { day: 7, rewards: { gold: 1500, gems: 20, mana: 30 } },
  { day: 8, rewards: { gold: 800, food: 400 } },
  { day: 9, rewards: { gold: 900, wood: 400 } },
  { day: 10, rewards: { gold: 1000, gems: 15 } },
  { day: 11, rewards: { gold: 1100, stone: 400 } },
  { day: 12, rewards: { gold: 1200, iron: 200 } },
  { day: 13, rewards: { gold: 1300, mana: 40 } },
  { day: 14, rewards: { gold: 2000, gems: 30, mana: 50 } },
  { day: 15, rewards: { gold: 1500, food: 600 } },
  { day: 16, rewards: { gold: 1600, wood: 600 } },
  { day: 17, rewards: { gold: 1700, stone: 600 } },
  { day: 18, rewards: { gold: 1800, iron: 300 } },
  { day: 19, rewards: { gold: 1900, mana: 60 } },
  { day: 20, rewards: { gold: 2000, gems: 40 } },
  { day: 21, rewards: { gold: 3000, gems: 50, mana: 80 } },
  { day: 22, rewards: { gold: 2200, food: 800 } },
  { day: 23, rewards: { gold: 2400, wood: 800 } },
  { day: 24, rewards: { gold: 2600, stone: 800 } },
  { day: 25, rewards: { gold: 2800, iron: 400 } },
  { day: 26, rewards: { gold: 3000, mana: 100 } },
  { day: 27, rewards: { gold: 3200, gems: 60 } },
  { day: 28, rewards: { gold: 3500, gems: 70, mana: 120 } },
  { day: 29, rewards: { gold: 4000, gems: 80 } },
  { day: 30, rewards: { gold: 5000, gems: 100, mana: 150, food: 1000, wood: 1000, stone: 1000, iron: 500 } }
];

const seasonalEvents = [
  { id: 'spring_festival', name: 'Spring Festival', icon: '🌸', duration: '7 days', active: true, progress: 45 },
  { id: 'summer_war', name: 'Summer War', icon: '☀️', duration: '14 days', active: false, progress: 0 },
  { id: 'autumn_harvest', name: 'Autumn Harvest', icon: '🌾', duration: '10 days', active: false, progress: 0 },
  { id: 'winter_solstice', name: 'Winter Solstice', icon: '❄️', duration: '21 days', active: false, progress: 0 },
  { id: 'dragon_awakening', name: 'Dragon Awakening', icon: '🐉', duration: '5 days', active: true, progress: 75 },
  { id: 'kingdom_clash', name: 'Kingdom Clash', icon: '⚔️', duration: '3 days', active: false, progress: 0 }
];

const dailyQuestsData = [
  { id: 'build_1', name: 'Builder', description: 'Construct or upgrade 1 building', reward: { gold: 500, xp: 10 }, completed: false },
  { id: 'train_10', name: 'Recruiter', description: 'Train 10 units', reward: { gold: 400, food: 100, xp: 10 }, completed: false },
  { id: 'battle_3', name: 'Warrior', description: 'Win 3 battles', reward: { gold: 600, honor: 50, xp: 15 }, completed: false },
  { id: 'research_1', name: 'Scholar', description: 'Complete 1 research', reward: { gold: 700, xp: 20 }, completed: false },
  { id: 'collect_resources', name: 'Gatherer', description: 'Collect 5000 resources', reward: { gold: 300, xp: 5 }, completed: false },
  { id: 'hero_level', name: 'Mentor', description: 'Level up a hero', reward: { gold: 800, xp: 15 }, completed: false },
  { id: 'alliance_help', name: 'Team Player', description: 'Help alliance members 5 times', reward: { guild_coins: 50, xp: 10 }, completed: false },
  { id: 'world_explore', name: 'Explorer', description: 'Explore 10 tiles on world map', reward: { gold: 500, event_tokens: 5, xp: 10 }, completed: false },
  { id: 'spend_gems', name: 'Investor', description: 'Spend 50 gems', reward: { gold: 2000, xp: 20 }, completed: false },
  { id: 'daily_login', name: 'Loyal Player', description: 'Login daily', reward: { gems: 5, xp: 5 }, completed: true }
];

// Initialize daily rewards
if (!gameState.dailyRewards) {
  gameState.dailyRewards = {
    lastClaim: null,
    daysClaimed: 0
  };
}

// Initialize events modal
function initEventsModal() {
  populateDailyRewards();
  populateActiveEvents();
  populateDailyQuests();
}

// Populate daily login rewards
function populateDailyRewards() {
  const content = document.getElementById('dailyRewardsContent');
  
  let html = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h3>30-Day Login Rewards</h3>
      <p style="color: var(--text-secondary); margin: 10px 0;">Login daily to claim amazing rewards!</p>
      <p style="font-size: 20px; font-weight: bold; color: var(--color-primary);">Day ${gameState.dailyRewards.daysClaimed + 1}</p>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-bottom: 30px;">
  `;
  
  dailyRewardsData.forEach((dayReward, index) => {
    const isClaimed = index < gameState.dailyRewards.daysClaimed;
    const isCurrent = index === gameState.dailyRewards.daysClaimed;
    const isLocked = index > gameState.dailyRewards.daysClaimed;
    
    let rewardHTML = '';
    for (let resource in dayReward.rewards) {
      const icon = getResourceIcon(resource);
      rewardHTML += `<div style="font-size: 11px;">${icon} ${dayReward.rewards[resource]}</div>`;
    }
    
    html += `
      <div style="
        padding: 12px; 
        background: ${isClaimed ? 'var(--bg-light)' : isCurrent ? 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' : 'var(--bg-dark)'};
        border: 2px solid ${isClaimed ? 'var(--color-success)' : isCurrent ? 'var(--color-secondary)' : 'var(--border-color)'};
        border-radius: var(--radius-md);
        text-align: center;
        opacity: ${isLocked ? '0.5' : '1'};
        position: relative;
      ">
        <div style="font-weight: bold; margin-bottom: 8px; color: ${isCurrent ? 'white' : 'var(--text-primary)'}">Day ${dayReward.day}</div>
        <div style="font-size: 11px; color: ${isCurrent ? 'white' : 'var(--text-secondary)'}">${rewardHTML}</div>
        ${isClaimed ? '<div style="position: absolute; top: 5px; right: 5px; color: var(--color-success); font-size: 18px;">✓</div>' : ''}
        ${isCurrent ? '<div style="margin-top: 8px; font-size: 10px; color: white; font-weight: bold;">CLAIM</div>' : ''}
      </div>
    `;
  });
  
  html += '</div>';
  
  const canClaim = !gameState.dailyRewards.lastClaim || 
    (Date.now() - gameState.dailyRewards.lastClaim > 24 * 60 * 60 * 1000);
  
  html += `
    <div style="text-align: center;">
      <button class="btn btn--primary" onclick="claimDailyReward()" 
              ${!canClaim || gameState.dailyRewards.daysClaimed >= 30 ? 'disabled' : ''}
              style="padding: 15px 40px; font-size: 18px;">
        ${canClaim ? 'Claim Today\'s Reward' : 'Already Claimed Today'}
      </button>
    </div>
  `;
  
  content.innerHTML = html;
}

// Claim daily reward
function claimDailyReward() {
  const canClaim = !gameState.dailyRewards.lastClaim || 
    (Date.now() - gameState.dailyRewards.lastClaim > 24 * 60 * 60 * 1000);
  
  if (!canClaim) {
    showNotification('You already claimed today\'s reward!', 'warning');
    return;
  }
  
  if (gameState.dailyRewards.daysClaimed >= 30) {
    showNotification('You\'ve claimed all 30 days!', 'success');
    return;
  }
  
  const dayReward = dailyRewardsData[gameState.dailyRewards.daysClaimed];
  addResources(dayReward.rewards);
  
  gameState.dailyRewards.daysClaimed++;
  gameState.dailyRewards.lastClaim = Date.now();
  
  showNotification(`Day ${dayReward.day} reward claimed!`);
  populateDailyRewards();
}

// Populate active events
function populateActiveEvents() {
  const content = document.getElementById('activeEventsContent');
  
  let html = '<div style="display: grid; gap: 15px;">';
  
  seasonalEvents.forEach(event => {
    html += `
      <div class="list-item" style="${event.active ? 'border-color: var(--color-success);' : 'opacity: 0.6;'}">
        <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
          <div style="font-size: 48px;">${event.icon}</div>
          <div style="flex: 1;">
            <div class="list-item-title">${event.name}</div>
            <div class="list-item-desc">Duration: ${event.duration} ${event.active ? '(Active)' : '(Upcoming)'}</div>
            ${event.active ? `
              <div class="progress-bar" style="margin-top: 8px;">
                <div class="progress-fill" style="width: ${event.progress}%;">${event.progress}% Complete</div>
              </div>
            ` : ''}
          </div>
        </div>
        <button class="btn ${event.active ? 'btn--success' : 'btn--secondary'}" 
                ${!event.active ? 'disabled' : ''}>
          ${event.active ? 'View Event' : 'Coming Soon'}
        </button>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

// Populate daily quests
function populateDailyQuests() {
  const content = document.getElementById('dailyQuestsContent');
  
  let html = `
    <div style="text-align: center; margin-bottom: 20px;">
      <h3>Daily Quests</h3>
      <p style="color: var(--text-secondary);">Complete quests to earn rewards! Resets daily.</p>
    </div>
    <div style="display: grid; gap: 10px;">
  `;
  
  dailyQuestsData.forEach(quest => {
    let rewardHTML = '';
    for (let resource in quest.reward) {
      if (resource === 'xp') continue;
      const icon = getResourceIcon(resource);
      rewardHTML += `${icon} ${quest.reward[resource]} `;
    }
    if (quest.reward.xp) {
      rewardHTML += `⭐ ${quest.reward.xp} XP`;
    }
    
    html += `
      <div class="list-item" style="${quest.completed ? 'border-color: var(--color-success); opacity: 0.7;' : ''}">
        <div style="flex: 1;">
          <div class="list-item-title">${quest.name}</div>
          <div class="list-item-desc">${quest.description}</div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">Rewards: ${rewardHTML}</div>
        </div>
        ${quest.completed ? 
          '<span style="color: var(--color-success); font-weight: bold;">✓ Completed</span>' :
          '<button class="btn btn--primary" style="padding: 8px 16px;">Track</button>'
        }
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}