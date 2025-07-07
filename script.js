// Game configuration and state variables
const GOAL_CANS = 25;        // Total items needed to collect
let currentCans = 0;         // Current number of items collected
let gameActive = false;      // Tracks if game is currently running
let spawnInterval;          // Holds the interval for spawning items
let timerInterval;          // Holds the interval for the countdown timer
let timeLeft = 30;          // Time remaining in seconds

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

// Spawns a new item in a random grid cell
function spawnWaterCan() {
  if (!gameActive) return; // Stop if the game is not active
  const cells = document.querySelectorAll('.grid-cell');
  
  // Clear all cells before spawning a new water can
  cells.forEach(cell => (cell.innerHTML = ''));

  // Select a random cell from the grid to place the water can
  const randomCell = cells[Math.floor(Math.random() * cells.length)];

  // Use a template literal to create the wrapper and water-can element
  randomCell.innerHTML = `
    <div class="water-can-wrapper">
      <div class="water-can"></div>
    </div>
  `;

  // Add click event listener to the newly created water can
  const waterCan = randomCell.querySelector('.water-can');
  waterCan.addEventListener('click', collectWaterCan);
}

// Function to handle when a water can is clicked
function collectWaterCan(event) {
  if (!gameActive) return; // Only allow collection if game is active
  
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
  
  // Check if player won or lost based on score
  if (currentCans >= 20) {
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
  
  // Reset the score to 0 when starting a new game
  currentCans = 0;
  document.getElementById('current-cans').textContent = currentCans;
  
  // Reset timer to 30 seconds
  timeLeft = 30;
  document.getElementById('timer').textContent = timeLeft;
  
  // Clear any previous end game message
  const achievementDiv = document.getElementById('achievements');
  achievementDiv.textContent = '';
  achievementDiv.style.display = 'none';
  achievementDiv.style.animation = 'none'; // Reset animation
  
  createGrid(); // Set up the game grid
  spawnInterval = setInterval(spawnWaterCan, 1000); // Spawn water cans every second
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

// Set up click handler for the start button
document.getElementById('start-game').addEventListener('click', startGame);
