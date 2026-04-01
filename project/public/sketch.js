// This variable will hold the serial connection between Arduino and p5.js
let serial;

// POSITION 
// Starting position of the car on the canvas
let x = 200;
let y = 200;

// JOYSTICK VALUES 
// These start in the middle because most joysticks rest around 512, 512
// joyX controls left/right
// joyY controls up/down
let joyX = 512;
let joyY = 512;

// TOF SENSOR 
// Time-of-Flight sensor value coming from Arduino
// This will be used to control the speed of the car
let tofValue = 0;

// This is the mapped speed after converting sensor values
// into a more useful movement range for the game
let speedMapped = 0;

// DIRECTION 
// This stores the angle the car is facing in radians
// We use this so the car can rotate and move in the same direction
let angle = 0;

function setup() {
  // Make the canvas fill the browser window
  createCanvas(windowWidth, windowHeight);

  // Start the serial connection so p5 can read Arduino data
  setupSerial();
}

function draw() {
  // Clear the screen every frame with a dark background
  background(10);

  // JOYSTICK DIRECTION 
  // Shift joystick values so the center becomes 0,0 instead of 512,512
  // This makes the math easier for direction
  let dx = joyX - 512;
  
  // Invert Y so pushing the joystick up feels like "up" on the screen
  // Without this, the movement would feel backwards vertically
  let dy = -(joyY - 512);

  // Deadzone is used so tiny accidental joystick movements do not move the car
  // This helps prevent drifting when the joystick is close to center
  let deadzone = 80;

  // Calculate how far the joystick is from the center
  // This is the length of the direction vector
  let magnitude = sqrt(dx * dx + dy * dy);

  // Only update direction if the joystick is far enough from the center
  if (magnitude > deadzone) {
    // Normalize the direction values so they become a unit vector
    // This keeps direction clean without making diagonal movement stronger
    dx /= magnitude;
    dy /= magnitude;

    // atan2 gives the angle based on the x and y direction
    // This angle is used for both rotating the car and moving it
    angle = atan2(dy, dx);
  }

  // SPEED CONTROL 
  // Convert TOF sensor values into a speed value from 0 to 10
  // If the TOF range changes later, this map can be adjusted
  speedMapped = map(tofValue, 0, 1023, 0, 10);

  // Make sure the speed stays within the intended range
  speedMapped = constrain(speedMapped, 0, 10);

  // MOVEMENT 
  // Move the car based on its angle and speed
  // cos(angle) affects horizontal movement
  // sin(angle) affects vertical movement
  x += cos(angle) * speedMapped;
  y += sin(angle) * speedMapped;

  // Keep the car inside the canvas so it does not disappear off screen
  x = constrain(x, 0, width);
  y = constrain(y, 0, height);

  //  DRAW CAR 
  // Save the current drawing settings
  push();

  // Move the drawing origin to the car's position
  translate(x, y);

  // Rotate the drawing so the car points in the direction it is moving
  rotate(angle);

  // Draw the car at the translated/rotated origin
  drawCar();

  // Restore the original drawing settings so later drawings are not affected
  pop();

  // DIRECTION LINE 
  // Draw a green line showing the direction the car is facing
  // This is mainly useful for testing and debugging
  stroke(0, 255, 0);
  line(x, y, x + cos(angle) * 50, y + sin(angle) * 50);

  // DEBUG TEXT 
  // Turn off stroke so text looks cleaner
  noStroke();

  // Set text color to white
  fill(255);

  // Set text size
  textSize(14);

  // Show useful values on the screen for testing
  text("X: " + int(x), 20, 30);
  text("Y: " + int(y), 20, 50);
  text("Speed: " + speedMapped.toFixed(2), 20, 70);
  text("Angle: " + degrees(angle).toFixed(1), 20, 90);
  text("JoyX: " + int(joyX), 20, 110);
  text("JoyY: " + int(joyY), 20, 130);
  text("TOF: " + int(tofValue), 20, 150);
}

function drawCar() {
  // Draw shapes from their center instead of from the corner
  rectMode(CENTER);

  // CAR BODY
  fill(200, 50, 50); // red-ish color
  stroke(0);         // black outline
  rect(0, 0, 100, 50, 10); // car body with rounded corners

  // WHEELS 
  fill(50); // dark gray wheels
  ellipse(-30, -25, 20);
  ellipse(30, -25, 20);
  ellipse(-30, 25, 20);
  ellipse(30, 25, 20);
}

function setupSerial() {
  // Check that the p5 serial library actually loaded
  // If it did not, serial will not work and the code should stop here
  if (typeof p5.SerialPort === "undefined") {
    console.log("Serial library not loaded");
    return;
  }

  try {
    // Create a new serial object
    serial = new p5.SerialPort();

    // List available serial ports in the console
    // This helps find the right COM port
    serial.list();

    // Open the Arduino serial port
    // Change COM7 if your Arduino is on a different port
    serial.open('COM7');

    // Every time serial data arrives, run gotData()
    serial.on('data', gotData);

    console.log("Serial connected");
  } catch (err) {
    // If something fails, print the error to the console
    console.log("Serial failed:", err);
  }
}

// READ SERIAL DATA
function gotData() {
  // Read one line from the serial buffer
  let currentString = serial.readLine();

  // If there is nothing there, stop
  if (!currentString) return;

  // Remove extra spaces or line breaks
  currentString = currentString.trim();

  // If the string is empty after trimming, stop
  if (!currentString) return;

  // Split the incoming line by commas
  // Expected format: joystickX,joystickY,tofValue
  let parts = currentString.split(',');

  // Only continue if all 3 values were received
  if (parts.length === 3) {
    // Convert each piece into a number
    let jx = Number(parts[0]);
    let jy = Number(parts[1]);
    let tof = Number(parts[2]);

    // Only update values if they are real numbers
    // This helps prevent errors from bad serial input
    if (!isNaN(jx)) joyX = jx;
    if (!isNaN(jy)) joyY = jy;
    if (!isNaN(tof)) tofValue = tof;
  }
}

//  WINDOW RESIZE 
// If the browser window changes size, resize the canvas too
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}