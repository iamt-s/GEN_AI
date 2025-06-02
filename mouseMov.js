const robot = require("robotjs");

// Function to move the mouse
function moveMouse() {
  // Get the screen size
  const screenSize = robot.getScreenSize();
  
  // Randomly move the mouse within the screen bounds
  const x = Math.floor(Math.random() * screenSize.width);
  const y = Math.floor(Math.random() * screenSize.height);
  
  // Move the mouse to the (x, y) position
  robot.moveMouse(x, y);
  
  console.log(`Moved mouse to: (${x}, ${y})`);
}

// Set an interval to move the mouse every 30 seconds (30000ms)
setInterval(moveMouse, 30000);
