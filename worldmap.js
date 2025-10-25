// ===================================
// WORLD MAP SYSTEM
// ===================================

// World map tile types
const tileTypes = {
  plains: { icon: '🌾', color: '#86efac', resource: null },
  forest: { icon: '🌳', color: '#22c55e', resource: 'wood' },
  mountain: { icon: '⛰️', color: '#78716c', resource: 'stone' },
  water: { icon: '🌊', color: '#3b82f6', resource: null },
  desert: { icon: '🏜️', color: '#fbbf24', resource: null },
  iron_deposit: { icon: '⛏️', color: '#64748b', resource: 'iron' },
  gold_mine: { icon: '⛏️', color: '#eab308', resource: 'gold' },
  monster_camp: { icon: '👹', color: '#ef4444', resource: null }
};

// Generate a procedural world map section
function generateMapSection(centerX, centerY, radius = 10) {
  const tiles = [];
  
  for (let y = centerY - radius; y <= centerY + radius; y++) {
    for (let x = centerX - radius; x <= centerX + radius; x++) {
      // Use pseudo-random generation based on coordinates
      const hash = (x * 73856093) ^ (y * 19349663);
      const rand = Math.abs(Math.sin(hash)) * 100;
      
      let tileType = 'plains';
      if (rand < 15) tileType = 'forest';
      else if (rand < 25) tileType = 'mountain';
      else if (rand < 30) tileType = 'water';
      else if (rand < 35) tileType = 'desert';
      else if (rand < 38) tileType = 'iron_deposit';
      else if (rand < 40) tileType = 'gold_mine';
      else if (rand < 43) tileType = 'monster_camp';
      
      tiles.push({
        x,
        y,
        type: tileType,
        level: Math.floor(rand / 10) + 1,
        occupied: false
      });
    }
  }
  
  return tiles;
}

// Player position on world map
if (!gameState.worldPosition) {
  gameState.worldPosition = { x: 500, y: 500 };
}

// Initialize world map modal
function initWorldMapModal() {
  populateWorldMap();
}

// Populate world map
function populateWorldMap() {
  const content = document.getElementById('worldMapContent');
  
  const tiles = generateMapSection(gameState.worldPosition.x, gameState.worldPosition.y, 8);
  
  let html = `
    <div style="margin-bottom: 20px; text-align: center;">
      <h3>World Map</h3>
      <p style="color: var(--text-secondary);">Coordinates: (${gameState.worldPosition.x}, ${gameState.worldPosition.y})</p>
      <div style="display: flex; gap: 10px; justify-content: center; margin-top: 15px;">
        <button class="btn btn--secondary" onclick="moveMap(0, -5)">↑ North</button>
        <button class="btn btn--secondary" onclick="moveMap(-5, 0)">← West</button>
        <button class="btn btn--secondary" onclick="moveMap(5, 0)">East →</button>
        <button class="btn btn--secondary" onclick="moveMap(0, 5)">↓ South</button>
      </div>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(17, 40px); gap: 2px; justify-content: center; background: var(--bg-dark); padding: 15px; border-radius: var(--radius-lg); overflow: auto;">
  `;
  
  tiles.forEach(tile => {
    const tileData = tileTypes[tile.type];
    const isCenter = tile.x === gameState.worldPosition.x && tile.y === gameState.worldPosition.y;
    
    html += `
      <div 
        style="
          width: 40px; 
          height: 40px; 
          background: ${tileData.color}; 
          border-radius: 4px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 24px;
          cursor: pointer;
          border: ${isCenter ? '3px solid var(--color-secondary)' : '1px solid rgba(0,0,0,0.2)'};
          transition: var(--transition);
        "
        onclick="interactWithTile(${tile.x}, ${tile.y}, '${tile.type}', ${tile.level})"
        title="${tile.type} (${tile.x}, ${tile.y})"
      >
        ${isCenter ? '👑' : tileData.icon}
      </div>
    `;
  });
  
  html += '</div>';
  
  html += `
    <div style="margin-top: 20px; padding: 15px; background: var(--bg-light); border-radius: var(--radius-lg);">
      <h4 style="margin-bottom: 10px;">Map Legend</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 8px; font-size: 12px;">
        <div>🌾 Plains</div>
        <div>🌳 Forest (Wood)</div>
        <div>⛰️ Mountain (Stone)</div>
        <div>🌊 Water</div>
        <div>🏜️ Desert</div>
        <div>⛏️ Iron Deposit</div>
        <div>⛏️ Gold Mine</div>
        <div>👹 Monster Camp</div>
      </div>
    </div>
  `;
  
  content.innerHTML = html;
}

// Move on map
function moveMap(dx, dy) {
  gameState.worldPosition.x += dx;
  gameState.worldPosition.y += dy;
  
  // Keep within bounds
  gameState.worldPosition.x = Math.max(0, Math.min(1000, gameState.worldPosition.x));
  gameState.worldPosition.y = Math.max(0, Math.min(1000, gameState.worldPosition.y));
  
  populateWorldMap();
}

// Interact with tile
function interactWithTile(x, y, type, level) {
  const tileData = tileTypes[type];
  
  if (type === 'monster_camp') {
    if (confirm(`Attack Monster Camp (Level ${level})?\n\nThis will cost energy and may result in battle!`)) {
      const playerPower = calculateArmyPower() + calculateHeroPower();
      const monsterPower = level * 500;
      const victory = playerPower > monsterPower * 0.7;
      
      if (victory) {
        const rewards = {
          gold: level * 200,
          xp: level * 30
        };
        addResources(rewards);
        if (rewards.xp) addXP(rewards.xp);
        showNotification(`Defeated monsters! +${rewards.gold} gold, +${rewards.xp} XP`);
      } else {
        showNotification('Defeated by monsters! Your army needs more power.', 'error');
      }
    }
  } else if (tileData.resource) {
    if (confirm(`Gather ${tileData.resource} from this location?\n\nThis will take time and you'll collect resources.`)) {
      const amount = level * 100;
      const reward = {};
      reward[tileData.resource] = amount;
      addResources(reward);
      showNotification(`Gathered ${amount} ${tileData.resource}!`);
    }
  } else {
    showNotification(`This is a ${type} tile. Nothing to interact with here.`, 'info');
  }
}