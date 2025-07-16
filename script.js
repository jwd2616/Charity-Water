// Game configurat// Function to initialize sound effects
function initializeSounds() {
  // Water drop sound for collecting cans
  // Replace 'YOUR_WATER_DROP_SOUND_URL' with your actual sound URL
  // Example: soundEffects.waterDrop = new Audio('sounds/water-drop.mp3');
  soundEffects.waterDrop = new Audio('https://freesound.org/people/Aiwha/sounds/415484/');
  soundEffects.waterDrop.volume = 0.5; // Set volume to 50%
  
  // Broken pipe sound for clicking broken pipes
  // Replace 'YOUR_BROKEN_PIPE_SOUND_URL' with your actual sound URL
  // Example: soundEffects.brokenPipe = new Audio('sounds/pipe-break.mp3');
  soundEffects.brokenPipe = new Audio('YOUR_BROKEN_PIPE_SOUND_URL');
  soundEffects.brokenPipe.volume = 0.5; // Set volume to 50%
}

// Game configuration and state variables
const GOAL_CANS = 25;        // Default total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;          // Holds the interval for the countdown timer
let timeLeft = 30;          // Time remaining in seconds
let currentDifficulty = 'normal'; // Current difficulty setting

// Sound configuration - replace URLs with your actual sound files
const soundEffects = {
  waterDrop: null,  // Will hold the water drop sound
  brokenPipe: null  // Will hold the broken pipe sound
};

// Sound control state
let soundEnabled = true;

// Function to initialize sound effects
function initializeSounds() {
  // Water drop sound for collecting cans
  // Using local sound file from sounds folder
  soundEffects.waterDrop = new Audio('sounds/water-drip-45622.mp3');
  soundEffects.waterDrop.volume = 0.5; // Set volume to 50%
  
  // Broken pipe sound for clicking broken pipes
  // Using local sound file from sounds folder
  soundEffects.brokenPipe = new Audio('sounds/pipe-bang-306438.mp3');
  soundEffects.brokenPipe.volume = 0.5; // Set volume to 50%
}

// Function to play a sound effect safely
function playSound(soundName) {
  // Only play if sound is enabled
  if (!soundEnabled) return;
  
  // Check if sound exists and is loaded
  if (soundEffects[soundName]) {
    try {
      // Reset sound to beginning and play
      soundEffects[soundName].currentTime = 0;
      soundEffects[soundName].play().catch(error => {
        // Handle any errors (like if user hasn't interacted with page yet)
        console.log(`Could not play ${soundName} sound:`, error);
      });
    } catch (error) {
      console.log(`Error playing ${soundName} sound:`, error);
    }
  }
}

// Difficulty settings for different game modes
const difficultySettings = {
  easy: {
    winGoal: 15,           // Need 15 cans to win
    timeLimit: 45,         // 45 seconds to play
    spawnSpeed: 1200,      // Items spawn every 1.2 seconds (slower)
    brokenPipeChance: 0.2, // 20% chance for broken pipes
    name: 'Easy'
  },
  normal: {
    winGoal: 20,           // Need 20 cans to win
    timeLimit: 30,         // 30 seconds to play
    spawnSpeed: 1000,      // Items spawn every 1 second
    brokenPipeChance: 0.3, // 30% chance for broken pipes
    name: 'Normal'
  },
  hard: {
    winGoal: 25,           // Need 25 cans to win
    timeLimit: 20,         // 20 seconds to play
    spawnSpeed: 800,       // Items spawn every 0.8 seconds (faster)
    brokenPipeChance: 0.4, // 40% chance for broken pipes
    name: 'Hard'
  }
};

// Arrays of possible end game messages
const winningMessages = [
  "Amazing work! You're making a real difference! 🎉",
  "Fantastic! You collected enough water for the community! 💪",
  "Incredible job! Clean water is on its way! 🌊",
  "You did it! Your efforts will help provide clean water! ✨",
  "Outstanding! You've helped bring hope to those in need! 🙌"
];

const losingMessages = [
  "Good effort! Try again to help more people get clean water! 💧",
  "So close! Every can counts - give it another try! 🌟",
  "Keep going! The community is counting on you! 💙",
  "Don't give up! Clean water is worth fighting for! 🚰",
  "Try again! You can make an even bigger impact! 🎯"
];

// Creates the 3x3 game grid where items will appear
function createGrid() {
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = ''; // Clear any existing grid cells
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell'; // Each cell represents a grid square
    grid.appendChild(cell);
  }
}

// Ensure the grid is created when the page loads
createGrid();

// Spawns a new item in a random grid cell (water can or broken pipe)
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new item
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the item
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use difficulty settings to determine broken pipe chance
  const currentSettings = difficultySettings[currentDifficulty];
  const shouldSpawnBrokenPipe = Math.random() < currentSettings.brokenPipeChance;

  if (shouldSpawnBrokenPipe) {
    // Spawn a broken pipe
    randomCell.innerHTML = `
      <div class="broken-pipe-wrapper">
        <div class="broken-pipe"></div>
      </div>
    `;

    // Add click event listener to the newly created broken pipe
    const brokenPipe = randomCell.querySelector('.broken-pipe');
    brokenPipe.addEventListener('click', clickBrokenPipe);
  } else {
    // Spawn a water can (existing logic)
    randomCell.innerHTML = `
      <div class="water-can-wrapper">
        <div class="water-can"></div>
      </div>
    `;

    // Add click event listener to the newly created water can
    const waterCan = randomCell.querySelector('.water-can');
    waterCan.addEventListener('click', collectWaterCan);
  }
}

// Function to handle when a broken pipe is clicked
function clickBrokenPipe(event) {
  if (!gameActive) return; // Only allow interaction if game is active
  
  // Play broken pipe sound effect
  playSound('brokenPipe');
  
  // Get the position of the clicked broken pipe
  const brokenPipeWrapper = event.target.closest('.broken-pipe-wrapper');
  const gridCell = brokenPipeWrapper.closest('.grid-cell');
  
  // Decrement the score by 1 (but don't go below 0)
  currentCans = Math.max(0, currentCans - 1);
  
  // Update the score display on the page
  document.getElementById('current-cans').textContent = currentCans;
  
  // Remove the clicked broken pipe from the grid
  brokenPipeWrapper.remove();
  
  // Optional: Add a visual effect to show it was a bad click
  gridCell.style.backgroundColor = '#ffcccc';
  setTimeout(() => {
    gridCell.style.backgroundColor = '';
  }, 300);
}

// Function to handle when a water can is clicked
function collectWaterCan(event) {
  if (!gameActive) return; // Only allow collection if game is active
  
  // Play water drop sound effect
  playSound('waterDrop');
  
  // Get the position of the clicked water can for splash effect
  const waterCanWrapper = event.target.closest('.water-can-wrapper');
  const gridCell = waterCanWrapper.closest('.grid-cell');
  
  // Create mini splash effect at the can's position
  createMiniWaterSplash(gridCell);
  
  // Increment the score by 1
  currentCans++;
  
  // Update the score display on the page
  document.getElementById('current-cans').textContent = currentCans;
  
  // Remove the clicked water can from the grid
  waterCanWrapper.remove();
}

// Function to update the timer display and handle countdown
function updateTimer() {
  // Update the timer display on the page
  document.getElementById('timer').textContent = timeLeft;
  
  // Decrease time by 1 second
  timeLeft--;
  
  // Check if time has run out
  if (timeLeft < 0) {
    endGame(); // End the game when timer reaches 0
  }
}

// Function to display a random message from an array
function getRandomMessage(messageArray) {
  // Pick a random index from the message array
  const randomIndex = Math.floor(Math.random() * messageArray.length);
  return messageArray[randomIndex];
}

// Function to show the end game message
function showEndGameMessage() {
  let message;
  let isWin = false;
  
  // Get current difficulty settings
  const currentSettings = difficultySettings[currentDifficulty];
  
  // Check if player won or lost based on difficulty goal
  if (currentCans >= currentSettings.winGoal) {
    // Player won - get a random winning message
    message = getRandomMessage(winningMessages);
    isWin = true;
  } else {
    // Player lost - get a random losing message
    message = getRandomMessage(losingMessages);
  }
  
  // Display the message in the achievements div
  const achievementDiv = document.getElementById('achievements');
  achievementDiv.textContent = message;
  
  // Show the message with animation by setting display to block
  achievementDiv.style.display = 'block';
  
  // Remove any previous animation and trigger a new one
  achievementDiv.style.animation = 'none';
  // Force a reflow to reset the animation
  achievementDiv.offsetHeight;
  // Apply the expanding animation
  achievementDiv.style.animation = 'expandFromCenter 0.6s cubic-bezier(0.17, 0.67, 0.34, 2)';
  
  // Add water splash effect if player won
  if (isWin) {
    createWaterSplash();
  }
}

// Function to create water splash effect for winning
function createWaterSplash() {
  // Create the main splash container
  const splashContainer = document.createElement('div');
  splashContainer.className = 'water-splash';
  
  // Create center splash effect
  const centerSplash = document.createElement('div');
  centerSplash.className = 'center-splash';
  splashContainer.appendChild(centerSplash);
  
  // Create multiple water droplets
  for (let i = 1; i <= 6; i++) {
    const droplet = document.createElement('div');
    droplet.className = `water-droplet droplet-${i}`;
    splashContainer.appendChild(droplet);
  }
  
  // Add splash to container
  document.querySelector('.container').appendChild(splashContainer);
  
  // Remove splash effect after animation completes
  setTimeout(() => {
    if (splashContainer.parentNode) {
      splashContainer.parentNode.removeChild(splashContainer);
    }
  }, 2000); // Remove after 2 seconds
}

// Function to create mini water splash effect when can is clicked
function createMiniWaterSplash(gridCell) {
  // Create the mini splash container
  const miniSplashContainer = document.createElement('div');
  miniSplashContainer.className = 'mini-water-splash';
  
  // Position the splash at the center of the grid cell
  const cellRect = gridCell.getBoundingClientRect();
  const containerRect = document.querySelector('.container').getBoundingClientRect();
  
  // Calculate position relative to container
  const left = cellRect.left - containerRect.left + (cellRect.width / 2) - 50; // 50 is half of splash width
  const top = cellRect.top - containerRect.top + (cellRect.height / 2) - 50; // 50 is half of splash height
  
  miniSplashContainer.style.left = `${left}px`;
  miniSplashContainer.style.top = `${top}px`;
  
  // Create mini center splash effect
  const miniCenterSplash = document.createElement('div');
  miniCenterSplash.className = 'mini-center-splash';
  miniSplashContainer.appendChild(miniCenterSplash);
  
  // Create mini water droplets
  for (let i = 1; i <= 4; i++) {
    const droplet = document.createElement('div');
    droplet.className = `mini-water-droplet mini-droplet-${i}`;
    miniSplashContainer.appendChild(droplet);
  }
  
  // Add mini splash to container
  document.querySelector('.container').appendChild(miniSplashContainer);
  
  // Remove mini splash effect after animation completes
  setTimeout(() => {
    if (miniSplashContainer.parentNode) {
      miniSplashContainer.parentNode.removeChild(miniSplashContainer);
    }
  }, 1000); // Remove after 1 second
}

// Initializes and starts a new game
function startGame() {
  if (gameActive) return; // Prevent starting a new game if one is already active
  gameActive = true;
  
  // Get current difficulty settings
  const currentSettings = difficultySettings[currentDifficulty];
  
  // Reset the score to 0 when starting a new game
  currentCans = 0;
  document.getElementById('current-cans').textContent = currentCans;
  
  // Reset timer based on difficulty
  timeLeft = currentSettings.timeLimit;
  document.getElementById('timer').textContent = timeLeft;
  
  // Clear any previous end game message
  const achievementDiv = document.getElementById('achievements');
  achievementDiv.textContent = '';
  achievementDiv.style.display = 'none';
  achievementDiv.style.animation = 'none'; // Reset animation
  
  createGrid(); // Set up the game grid
  
  // Use difficulty-based spawn speed
  spawnInterval = setInterval(spawnWaterCan, currentSettings.spawnSpeed);
  timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function endGame() {
  gameActive = false; // Mark the game as inactive
  clearInterval(spawnInterval); // Stop spawning water cans
  clearInterval(timerInterval); // Stop the timer countdown
  
  // Clear any remaining water cans from the grid
  const grid = document.querySelector('.game-grid');
  grid.innerHTML = '';
  createGrid(); // Recreate empty grid
  
  // Show the end game message based on score
  showEndGameMessage();
}

// Function to change difficulty setting
function changeDifficulty(difficulty) {
  currentDifficulty = difficulty;
  
  // Update the display to show current difficulty and goal
  updateDifficultyDisplay();
  
  // Update difficulty buttons to show which is selected
  updateDifficultyButtons();
}

// Function to update the game instructions based on difficulty
function updateDifficultyDisplay() {
  const currentSettings = difficultySettings[currentDifficulty];
  const instructionsElement = document.querySelector('.game-instructions');
  
  // Update instructions to show current difficulty goal
  instructionsElement.textContent = `${currentSettings.name} Mode: Collect ${currentSettings.winGoal} items in ${currentSettings.timeLimit} seconds!`;
}

// Function to update difficulty button styling
function updateDifficultyButtons() {
  // Remove active class from all buttons
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Add active class to current difficulty button
  const activeButton = document.querySelector(`[data-difficulty="${currentDifficulty}"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Function to toggle sound on/off
function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundButton = document.getElementById('sound-toggle');
  
  // Update button text based on sound state
  if (soundEnabled) {
    soundButton.textContent = '🔊 Sound On';
    soundButton.classList.remove('sound-off');
  } else {
    soundButton.textContent = '🔇 Sound Off';
    soundButton.classList.add('sound-off');
  }
}

// Function to initialize the sound system
function initializeGameSounds() {
  // Initialize sound effects
  initializeSounds();
  
  // Set up sound toggle button
  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', toggleSound);
  }
}

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);

// Set up difficulty button event listeners when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the sound system
  initializeGameSounds();
  
  // Add event listeners to difficulty buttons
  document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', () => {
      const difficulty = button.getAttribute('data-difficulty');
      changeDifficulty(difficulty);
    });
  });
  
  // Initialize display with default difficulty
  updateDifficultyDisplay();
  updateDifficultyButtons();
});

// Set up click handlers for difficulty buttons
document.querySelectorAll('.difficulty-btn').forEach(button => {
  button.addEventListener('click', (event) => {
    const difficulty = event.target.getAttribute('data-difficulty');
    changeDifficulty(difficulty);
  });
});

// Initial update to set difficulty display on page load
updateDifficultyDisplay();
//# sourceMappingURL=app.js.map
