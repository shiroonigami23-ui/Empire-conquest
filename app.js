// ===================================
// MAIN APPLICATION INITIALIZATION
// ===================================

// Loading screen management
let loadingProgress = 0;
const loadingSteps = [
  { text: 'Initializing Empire...', duration: 500 },
  { text: 'Loading Resources...', duration: 600 },
  { text: 'Building Structures...', duration: 700 },
  { text: 'Training Units...', duration: 500 },
  { text: 'Recruiting Heroes...', duration: 600 },
  { text: 'Preparing Battle Systems...', duration: 500 },
  { text: 'Finalizing...', duration: 400 }
];

// Start loading sequence
function startLoadingSequence() {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingProgressBar = document.getElementById('loadingProgress');
  const loadingText = document.getElementById('loadingText');
  
  loadingScreen.classList.add('active');
  
  let currentStep = 0;
  let totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
  let elapsedTime = 0;
  
  function updateLoadingStep() {
    if (currentStep >= loadingSteps.length) {
      // Loading complete
      loadingProgress = 100;
      loadingProgressBar.style.width = '100%';
      
      setTimeout(() => {
        loadingScreen.classList.remove('active');
        document.getElementById('gameContainer').classList.add('ready');
        initializeGame();
      }, 500);
      return;
    }
    
    const step = loadingSteps[currentStep];
    loadingText.textContent = step.text;
    
    // Animate progress
    const stepProgress = ((elapsedTime + step.duration) / totalDuration) * 100;
    loadingProgressBar.style.width = stepProgress + '%';
    
    elapsedTime += step.duration;
    currentStep++;
    
    setTimeout(updateLoadingStep, step.duration);
  }
  
  updateLoadingStep();
}

// Initialize the game
function initializeGame() {
  // Initialize all systems
  initResources();
  initBuildingGrid();
  initUI();
  
  // Set initial action message
  updateActionMessage('Welcome to Empire Conquest! Start building your empire.');
  
  // Show welcome notification
  setTimeout(() => {
    showNotification('Welcome, Emperor! Your journey begins now.');
  }, 500);
  
  console.log('Empire Conquest initialized successfully!');
  console.log('Game State:', gameState);
}

// Update action bar message
function updateActionMessage(message) {
  const actionInfo = document.getElementById('actionInfo');
  if (actionInfo) {
    actionInfo.innerHTML = `<span>${message}</span>`;
  }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Empire Conquest - 4X Strategy Game');
  console.log('Version 1.0');
  console.log('Loading...');
  
  // Start loading sequence
  setTimeout(() => {
    startLoadingSequence();
  }, 100);
});

// Periodic updates
setInterval(() => {
  // Update player stats display
  if (gameState.player) {
    document.getElementById('playerName').textContent = gameState.player.name;
    document.getElementById('playerLevel').textContent = gameState.player.level;
  }
}, 5000);

// Auto-save simulation (just logs for now since we can't use localStorage)
setInterval(() => {
  const autoSave = document.getElementById('autoSave');
  if (autoSave && autoSave.checked) {
    console.log('Auto-save: Game state saved', new Date().toLocaleTimeString());
  }
}, 60000); // Every minute

// Log game statistics periodically
setInterval(() => {
  console.log('=== Empire Statistics ===');
  console.log('Resources:', gameState.resources);
  console.log('Buildings:', gameState.buildings.length);
  console.log('Units:', Object.values(gameState.units).reduce((a, b) => a + b, 0));
  console.log('Heroes:', gameState.heroes.length);
  console.log('Research:', gameState.researched.length);
  console.log('Player Level:', gameState.player.level);
  console.log('========================');
}, 120000); // Every 2 minutes