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
 * An idea I had for movement, wasnt sure where to put it
 * Adjust as needed
 * 
 * 
 * let blueXDir = 0;
 * let blueYDir = 0;
 * 
 * xBlue = map(blueX, 0, 1024, 0, 1024); values could change - I am estimating
 * yBlue = map(blueY, 0, 1024, 0, 1024);
 * 
 * speedBlue = (blueTOF, 0, 2000, 0, 10)
 * 
 * //Positive Positive
 * if (xBlue > 512 && yBlue > 512){  
      xDir = 1;
      yDir = 1;

 
  }
  //Negative Negative direction
  else if (xBlue < 512 && yBlue < 512){  
    xDir = -1;
    yDir = -1;

  }
  // Negative Positive Direction
  else if (xBlue < 512 && yBlue > 512){  
    xDir = -1;
    yDir = 1;

  }
  // Positive Negative Direction
  else if (xBlue > 512 && yBlue < 512){  
    xDir = 1;
    yDir = -1;

  }

  xBluePos += xDir * speedBlue * 0.1;
  yBluePos += yDir * speedBlue * 0.1;

 */