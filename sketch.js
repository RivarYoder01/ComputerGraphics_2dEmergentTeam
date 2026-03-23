//https://medium.com/geekculture/multiplayer-interaction-with-p5js-f04909e13b87  <- This is the link that I will be using for research on this topic

let joystickX = 0;
let joystickY = 0;
let sensor = "";

//let personalSensor1 = 0;    
//let personalSensor2 = 0;    //If you don't need a second sensor just comment this out... Or leave it, idk if it really makes a difference


// Purple, Blue, Red, Yellow, Green
let serial;
let latestPurpleX = 0;
let latestPurpleY = 0;
let latestPhotoCell = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  setupSerial();
}

function draw() {
   background(10);
   
  //purple blob

  // Circle's location based on forceSwing
  circle(latestPurpleX, latestPurpleY, 100);
  fill(300);
  textSize(14);

  text('Purple X: ' + int(latestPurpleX), 20, 30);
  text('Purple Y: ' + int(latestPurpleY), 20, 80);
  text('Purple Speed: ' + int(latestPurpleY), 20, 120);
}

function setupSerial() {
  serial = new p5.SerialPort();
  // List available ports in console
  serial.list();

  serial.open('COM7');
  serial.on('data', gotData);
}
function gotData() {
  let currentString = serial.readLine();

  if (!currentString) return;
    currentString = currentString.trim();

  if (!currentString) return;
    let parts = currentString.split(',');

  if (parts.length === 2) {
    let purpleX = Number(parts[0]);
    let purpleY = Number(parts[1]);
    let purplePhotoCell = Number(parts[1]);

    if (!isNaN(purpleX)) latestPurpleX = purpleX;
    if (!isNaN(purpleY)) latestPurpleY = purpleY;
    if (!isNaN(purplePhotoCell)) latestPhotoCell = purplePhotoCell;
  }
}
function windowResized() {
resizeCanvas(windowWidth, windowHeight);
}

/**
let theta = 0;
let speedBlue = 0;

let xBluePos = 0;
let yBluePos = 0;

function draw() {

  updateDirection();
  updateSpeed();

  // Move using polar → rectangular Thank you Violet for this idea

  xBluePos += cos(theta) * speedBlue * 0.1;
  yBluePos += sin(theta) * speedBlue * 0.1;

  translate(width/2, height/2);
  fill(200);
  ellipse(xBluePos, yBluePos, 32, 32);
}

function updateDirectionFromJoystick() {
  let jx = map(joyX, 0, 1024, -1, 1);
  let jy = map(joyY, 0, 1024, -1, 1);

//Calculates the angle formed by a point, the origin, and the positive x-axis
//https://p5js.org/reference/p5/atan2/
  theta = atan2(jy, jx);
}

function updateSpeedFromSensor() {
  speedBlue = map(blueTOF, 0, 2000, 0, 100);
}


 */