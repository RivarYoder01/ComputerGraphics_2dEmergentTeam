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
