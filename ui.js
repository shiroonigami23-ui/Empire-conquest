// ===================================
// UI MANAGEMENT & INTERACTIONS
// ===================================

// Initialize all UI interactions
function initUI() {
  // Close modal buttons
  document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const modalId = this.dataset.modal;
      closeModal(modalId);
    });
  });

  // Click outside modal to close
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });

  // Menu buttons
  document.getElementById('buildingsMenuBtn').addEventListener('click', () => {
    // Show first empty slot or just refresh grid
    initBuildingGrid();
  });

  document.getElementById('armyMenuBtn').addEventListener('click', () => {
    initArmyModal();
    openModal('armyModal');
  });

  document.getElementById('researchMenuBtn').addEventListener('click', () => {
    initResearchModal();
    openModal('researchModal');
  });

  document.getElementById('heroesMenuBtn').addEventListener('click', () => {
    initHeroesModal();
    openModal('heroesModal');
  });

  document.getElementById('combatMenuBtn').addEventListener('click', () => {
    initCombatModal();
    openModal('combatModal');
  });

  document.getElementById('equipmentMenuBtn').addEventListener('click', () => {
    initEquipmentModal();
    openModal('equipmentModal');
  });

  document.getElementById('petsMenuBtn').addEventListener('click', () => {
    initPetsModal();
    openModal('petsModal');
  });

  document.getElementById('worldMapMenuBtn').addEventListener('click', () => {
    initWorldMapModal();
    openModal('worldMapModal');
  });

  document.getElementById('allianceMenuBtn').addEventListener('click', () => {
    initAllianceModal();
    openModal('allianceModal');
  });

  document.getElementById('shopMenuBtn').addEventListener('click', () => {
    initShopModal();
    openModal('shopModal');
  });

  document.getElementById('eventsMenuBtn').addEventListener('click', () => {
    initEventsModal();
    openModal('eventsModal');
  });

  // Top nav buttons
  document.getElementById('vipBtn').addEventListener('click', () => {
    initVIPModal();
    openModal('vipModal');
  });

  document.getElementById('questBtn').addEventListener('click', () => {
    initQuestsModal();
    openModal('questModal');
  });

  document.getElementById('achievementsBtn').addEventListener('click', () => {
    initAchievementsModal();
    openModal('achievementsModal');
  });

  document.getElementById('settingsBtn').addEventListener('click', () => {
    openModal('settingsModal');
    initSettings();
  });

  document.getElementById('profileBtn').addEventListener('click', () => {
    openModal('profileModal');
    initProfileModal();
  });

  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.dataset.tab;
      const parentModal = this.closest('.modal-body');
      
      // Remove active class from all tabs and contents in this modal
      parentModal.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
      parentModal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding content
      this.classList.add('active');
      parentModal.querySelector(`#${tabName}`).classList.add('active');
    });
  });

  // Settings sliders
  const musicVolume = document.getElementById('musicVolume');
  const musicVolumeValue = document.getElementById('musicVolumeValue');
  if (musicVolume) {
    musicVolume.addEventListener('input', function() {
      musicVolumeValue.textContent = this.value + '%';
    });
  }

  const sfxVolume = document.getElementById('sfxVolume');
  const sfxVolumeValue = document.getElementById('sfxVolumeValue');
  if (sfxVolume) {
    sfxVolume.addEventListener('input', function() {
      sfxVolumeValue.textContent = this.value + '%';
    });
  }

  // Profile save button
  document.getElementById('saveProfileBtn').addEventListener('click', () => {
    const nameInput = document.getElementById('profileNameInput');
    const name = nameInput.value.trim();
    
    if (name.length < 3) {
      showNotification('Name must be at least 3 characters!', 'error');
      return;
    }
    
    saveProfile(name, gameState.player.avatar);
  });

  // Initialize avatar options
  initAvatarOptions();
}

// Open modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

// Close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

// Show notification toast
function showNotification(message, type = 'success') {
  const toast = document.getElementById('notificationToast');
  const toastMessage = document.getElementById('toastMessage');
  
  toastMessage.textContent = message;
  
  // Set border color based on type
  if (type === 'error') {
    toast.style.borderColor = 'var(--color-danger)';
  } else if (type === 'warning') {
    toast.style.borderColor = 'var(--color-warning)';
  } else {
    toast.style.borderColor = 'var(--color-success)';
  }
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Initialize profile modal
function initProfileModal() {
  document.getElementById('profileNameInput').value = gameState.player.name;
  document.getElementById('profileAvatarInitial').textContent = gameState.player.avatar;
  
  // Update stats
  document.getElementById('statBuildings').textContent = gameState.stats.buildingsConstructed;
  document.getElementById('statUnits').textContent = gameState.stats.unitsTrained;
  document.getElementById('statBattles').textContent = gameState.stats.battlesWon;
  document.getElementById('statResearch').textContent = gameState.stats.researchCompleted;
}

// Initialize avatar options
function initAvatarOptions() {
  const avatarOptions = document.getElementById('avatarOptions');
  const avatars = ['👑', '⚔️', '🛡️', '🏆', '⭐', '🔥', '⚡', '💎'];
  
  avatarOptions.innerHTML = '';
  
  avatars.forEach((avatar, index) => {
    const option = document.createElement('div');
    option.className = 'avatar-option';
    option.style.background = `linear-gradient(135deg, hsl(${index * 45}, 70%, 50%), hsl(${index * 45 + 30}, 70%, 60%))`;
    option.textContent = avatar;
    
    option.addEventListener('click', function() {
      gameState.player.avatar = avatar;
      document.getElementById('profileAvatarInitial').textContent = avatar;
      document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
      this.classList.add('selected');
    });
    
    avatarOptions.appendChild(option);
  });
}

// Initialize settings
function initSettings() {
  // Settings are already initialized in HTML, nothing more needed here
}

// Initialize quests modal
function initQuestsModal() {
  const questsList = document.getElementById('questsList');
  
  // Define some quests
  const quests = [
    {
      id: 1,
      title: 'Build Your Empire',
      description: 'Construct 5 buildings',
      progress: gameState.stats.buildingsConstructed,
      goal: 5,
      reward: { gold: 500, xp: 50 },
      completed: gameState.stats.buildingsConstructed >= 5
    },
    {
      id: 2,
      title: 'Raise an Army',
      description: 'Train 50 units',
      progress: gameState.stats.unitsTrained,
      goal: 50,
      reward: { gold: 800, food: 200, xp: 75 },
      completed: gameState.stats.unitsTrained >= 50
    },
    {
      id: 3,
      title: 'Conqueror',
      description: 'Win 10 battles',
      progress: gameState.stats.battlesWon,
      goal: 10,
      reward: { gold: 1000, iron: 300, xp: 100 },
      completed: gameState.stats.battlesWon >= 10
    },
    {
      id: 4,
      title: 'Scholar',
      description: 'Complete 3 research projects',
      progress: gameState.stats.researchCompleted,
      goal: 3,
      reward: { gold: 1200, xp: 120 },
      completed: gameState.stats.researchCompleted >= 3
    }
  ];
  
  questsList.innerHTML = '';
  
  quests.forEach(quest => {
    const listItem = document.createElement('div');
    listItem.className = 'list-item';
    listItem.style.flexDirection = 'column';
    listItem.style.alignItems = 'flex-start';
    
    let rewardHTML = '';
    for (let resource in quest.reward) {
      if (resource === 'xp') continue;
      const icon = getResourceIcon(resource);
      rewardHTML += `${icon} ${quest.reward[resource]} `;
    }
    if (quest.reward.xp) {
      rewardHTML += `⭐ ${quest.reward.xp} XP`;
    }
    
    listItem.innerHTML = `
      <div style="width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <div>
            <div class="list-item-title">${quest.title}</div>
            <div class="list-item-desc">${quest.description}</div>
          </div>
          ${quest.completed ? 
            '<span style="color: var(--color-success); font-weight: bold;">✓ Completed</span>' :
            ''
          }
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${Math.min(100, (quest.progress / quest.goal) * 100)}%;">
            ${quest.progress}/${quest.goal}
          </div>
        </div>
        <div style="margin-top: 10px; font-size: 12px; color: var(--text-secondary);">
          Rewards: ${rewardHTML}
        </div>
      </div>
    `;
    
    questsList.appendChild(listItem);
  });
  
  // Update quest badge
  const incompletequests = quests.filter(q => !q.completed).length;
  const questBadge = document.getElementById('questBadge');
  if (incompletequests > 0) {
    questBadge.textContent = incompletequests;
    questBadge.style.display = 'block';
  } else {
    questBadge.style.display = 'none';
  }
}