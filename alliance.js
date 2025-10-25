// ===================================
// ALLIANCE/GUILD SYSTEM
// ===================================

// Mock alliances data
const mockAlliances = [
  { id: 1, name: 'Dragon Knights', level: 5, members: 42, power: 125000, leader: 'DragonLord' },
  { id: 2, name: 'Phoenix Rising', level: 7, members: 38, power: 185000, leader: 'PhoenixKing' },
  { id: 3, name: 'Shadow Legion', level: 4, members: 35, power: 98000, leader: 'ShadowMaster' },
  { id: 4, name: 'Golden Empire', level: 6, members: 45, power: 156000, leader: 'GoldenEmperor' },
  { id: 5, name: 'Storm Warriors', level: 3, members: 28, power: 72000, leader: 'StormChief' }
];

// Initialize alliance system
if (!gameState.alliance) {
  gameState.alliance = null;
}

// Initialize alliance modal
function initAllianceModal() {
  populateAllianceInfo();
  populateAllianceChat();
  populateAllianceMembers();
  populateAllianceWar();
}

// Populate alliance info tab
function populateAllianceInfo() {
  const content = document.getElementById('allianceInfoContent');
  
  if (!gameState.alliance) {
    // Show available alliances to join
    let html = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h3>Join an Alliance</h3>
        <p style="color: var(--text-secondary); margin: 15px 0;">Team up with other players for exclusive bonuses and rewards!</p>
      </div>
      <div style="display: grid; gap: 15px;">
    `;
    
    mockAlliances.forEach(alliance => {
      html += `
        <div class="list-item">
          <div class="list-item-info">
            <div class="list-item-title">${alliance.name}</div>
            <div class="list-item-desc">Leader: ${alliance.leader} | Level ${alliance.level}</div>
            <div style="margin-top: 8px; display: flex; gap: 15px; font-size: 12px; color: var(--text-secondary);">
              <span>👥 ${alliance.members}/50 members</span>
              <span>💪 Power: ${formatNumber(alliance.power)}</span>
            </div>
          </div>
          <button class="btn btn--success" onclick="joinAlliance(${alliance.id})">Join</button>
        </div>
      `;
    });
    
    html += `
      </div>
      <div style="margin-top: 30px; text-align: center;">
        <button class="btn btn--primary" onclick="createAlliance()" style="padding: 15px 30px;">
          Create Your Own Alliance (Cost: 💎 500 Gems)
        </button>
      </div>
    `;
    
    content.innerHTML = html;
  } else {
    // Show current alliance info
    const alliance = mockAlliances.find(a => a.id === gameState.alliance);
    content.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="font-size: 72px; margin-bottom: 15px;">🏛️</div>
        <h2 style="font-size: 28px; color: var(--color-secondary);">${alliance.name}</h2>
        <p style="color: var(--text-secondary);">Level ${alliance.level} Alliance</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
        <div style="background: var(--bg-light); padding: 20px; border-radius: var(--radius-lg); text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">👥</div>
          <div style="font-size: 24px; font-weight: bold; color: var(--color-primary);">${alliance.members}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Members</div>
        </div>
        <div style="background: var(--bg-light); padding: 20px; border-radius: var(--radius-lg); text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">💪</div>
          <div style="font-size: 24px; font-weight: bold; color: var(--color-primary);">${formatNumber(alliance.power)}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Total Power</div>
        </div>
        <div style="background: var(--bg-light); padding: 20px; border-radius: var(--radius-lg); text-align: center;">
          <div style="font-size: 32px; margin-bottom: 10px;">🏆</div>
          <div style="font-size: 24px; font-weight: bold; color: var(--color-primary);">#${alliance.id}</div>
          <div style="font-size: 12px; color: var(--text-secondary);">Rank</div>
        </div>
      </div>
      
      <div style="background: var(--bg-light); padding: 20px; border-radius: var(--radius-lg);">
        <h3 style="margin-bottom: 15px;">Alliance Bonuses</h3>
        <div style="display: grid; gap: 8px;">
          <div style="padding: 8px; background: var(--bg-medium); border-radius: var(--radius-md);">✓ Production +${alliance.level * 2}%</div>
          <div style="padding: 8px; background: var(--bg-medium); border-radius: var(--radius-md);">✓ Army Capacity +${alliance.level * 100}</div>
          <div style="padding: 8px; background: var(--bg-medium); border-radius: var(--radius-md);">✓ Alliance Shop Access</div>
          <div style="padding: 8px; background: var(--bg-medium); border-radius: var(--radius-md);">✓ Alliance Help</div>
        </div>
      </div>
      
      <div style="margin-top: 20px; text-align: center;">
        <button class="btn btn--danger" onclick="leaveAlliance()">Leave Alliance</button>
      </div>
    `;
  }
}

// Join alliance
function joinAlliance(allianceId) {
  const alliance = mockAlliances.find(a => a.id === allianceId);
  if (!alliance) return;
  
  gameState.alliance = allianceId;
  showNotification(`Joined ${alliance.name}!`);
  populateAllianceInfo();
  populateAllianceMembers();
}

// Create alliance
function createAlliance() {
  const cost = { gems: 500 };
  
  if (!hasEnoughResources(cost)) {
    showNotification('Not enough gems!', 'error');
    return;
  }
  
  deductResources(cost);
  
  // For demo, just join the first alliance
  gameState.alliance = 1;
  showNotification('Alliance created successfully!');
  populateAllianceInfo();
}

// Leave alliance
function leaveAlliance() {
  if (confirm('Are you sure you want to leave your alliance?')) {
    gameState.alliance = null;
    showNotification('Left alliance');
    populateAllianceInfo();
    populateAllianceMembers();
  }
}

// Populate alliance chat
function populateAllianceChat() {
  const content = document.getElementById('allianceChatContent');
  
  if (!gameState.alliance) {
    content.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Join an alliance to access chat!</p>';
    return;
  }
  
  const mockMessages = [
    { player: 'DragonLord', message: 'Welcome new members!', time: '2 min ago' },
    { player: 'WarriorKing', message: 'Let\'s attack the enemy alliance!', time: '5 min ago' },
    { player: 'MageQueen', message: 'I need help with monster hunting', time: '10 min ago' },
    { player: gameState.player.name, message: 'Hello everyone!', time: 'Just now' }
  ];
  
  let html = '<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">';
  
  mockMessages.forEach(msg => {
    const isMe = msg.player === gameState.player.name;
    html += `
      <div style="padding: 12px; background: ${isMe ? 'var(--color-primary)' : 'var(--bg-light)'}; border-radius: var(--radius-md); ${isMe ? 'margin-left: 40px;' : 'margin-right: 40px;'}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
          <strong style="font-size: 14px; color: ${isMe ? 'white' : 'var(--color-secondary)'}">${msg.player}</strong>
          <span style="font-size: 11px; color: ${isMe ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)'}">${msg.time}</span>
        </div>
        <div style="font-size: 13px; color: ${isMe ? 'white' : 'var(--text-primary)'}">${msg.message}</div>
      </div>
    `;
  });
  
  html += '</div>';
  html += `
    <div style="display: flex; gap: 10px;">
      <input type="text" class="form-control" placeholder="Type a message..." id="allianceChatInput">
      <button class="btn btn--primary" onclick="sendAllianceMessage()">Send</button>
    </div>
  `;
  
  content.innerHTML = html;
}

// Send alliance message
function sendAllianceMessage() {
  const input = document.getElementById('allianceChatInput');
  const message = input.value.trim();
  
  if (message) {
    showNotification('Message sent!');
    input.value = '';
  }
}

// Populate alliance members
function populateAllianceMembers() {
  const content = document.getElementById('allianceMembersContent');
  
  if (!gameState.alliance) {
    content.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Join an alliance to see members!</p>';
    return;
  }
  
  const mockMembers = [
    { name: 'DragonLord', role: 'Leader', level: 45, power: 15000, online: true },
    { name: 'WarriorKing', role: 'Officer', level: 42, power: 13500, online: true },
    { name: 'MageQueen', role: 'Officer', level: 40, power: 12800, online: false },
    { name: gameState.player.name, role: 'Member', level: gameState.player.level, power: calculateArmyPower() + calculateHeroPower(), online: true },
    { name: 'ShadowNinja', role: 'Member', level: 38, power: 11200, online: true },
    { name: 'HolyPaladin', role: 'Member', level: 36, power: 10500, online: false }
  ];
  
  let html = '<div style="display: grid; gap: 10px;">';
  
  mockMembers.forEach(member => {
    html += `
      <div class="list-item">
        <div style="display: flex; align-items: center; gap: 15px;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${member.online ? 'var(--color-success)' : 'var(--text-muted)'};"></div>
          <div class="list-item-info">
            <div class="list-item-title">${member.name} ${member.name === gameState.player.name ? '(You)' : ''}</div>
            <div class="list-item-desc">${member.role} | Level ${member.level} | Power: ${formatNumber(member.power)}</div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  content.innerHTML = html;
}

// Populate alliance war
function populateAllianceWar() {
  const content = document.getElementById('allianceWarContent');
  
  if (!gameState.alliance) {
    content.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Join an alliance to participate in wars!</p>';
    return;
  }
  
  content.innerHTML = `
    <div style="text-align: center; padding: 30px;">
      <div style="font-size: 72px; margin-bottom: 20px;">⚔️</div>
      <h3>Alliance War</h3>
      <p style="color: var(--text-secondary); margin: 15px 0;">Battle against other alliances for glory and rewards!</p>
      <p style="color: var(--color-warning); font-size: 18px; margin-top: 30px;">Next alliance war starts in: 2 days 14 hours</p>
      <button class="btn btn--primary" style="margin-top: 20px; padding: 15px 30px;" disabled>
        War In Progress
      </button>
    </div>
  `;
}