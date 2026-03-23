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
let joyX = 512;
let joyY = 512;
let blueTOF = 0;

let theta = 0;
let speedBlue = 0;
let xBluePos = 0;
let yBluePos = 0;

function draw() {
  background(10);

  // PURPLE BLOB
  fill(200, 100, 255);
  circle(latestPurpleX, latestPurpleY, 100);

  fill(255);
  textSize(14);
  text('Purple X: ' + int(latestPurpleX), 20, 30);
  text('Purple Y: ' + int(latestPurpleY), 20, 50);
  text('Purple Sensor: ' + int(latestPhotoCell), 20, 70);

  // BLUE BLOB
  updateDirection();
  updateSpeed();

  xBluePos += cos(theta) * speedBlue * 0.1;
  yBluePos += sin(theta) * speedBlue * 0.1;

  fill(100, 150, 255);
  ellipse(xBluePos, yBluePos, 50, 50);

  text('Joy X: ' + int(joyX), 20, 110);
  text('Joy Y: ' + int(joyY), 20, 130);
  text('Blue Speed Sensor: ' + int(blueTOF), 20, 150);
}

function updateDirection() {
  let jx = map(joyX, 0, 1024, -1, 1);
  let jy = map(joyY, 0, 1024, -1, 1);

//Calculates the angle formed by a point, the origin, and the positive x-axis
//https://p5js.org/reference/p5/atan2/
  theta = atan2(jy, jx);
}

function updateSpeed() {
  speedBlue = map(blueTOF, 0, 2000, 0, 100);
}


 */


/**
 * Breckin's testing code
 * //get container for our canvas
const sketchContainer = document.getElementById("sketch-container");

//get socket which only uses websockets as a means of communication
const socket = io({
  transports: ["websocket"]
});

//the p5js sketch
const sketch = (p) => {
  let positions = {};
  //the p5js setup function
  p.setup = () => {
    //to fill up the full container, get the width an height
    const containerPos = sketchContainer.getBoundingClientRect();
    const cnv = p.createCanvas(containerPos.width, containerPos.height); //the canvas!

    cnv.mousePressed(() => {
      //when you click on the canvas, update your position
      socket.emit("updatePosition", {
        x: p.mouseX / p.width, // always send relative number of position between 0 and 1
        y: p.mouseY / p.height //so it positions are the relatively the same on different screen sizes.
      });
    });
    p.fill(255); //sets the fill color of the circle to white
    p.frameRate(30); //set framerate to 30, same as server
    socket.on("positions", (data) => {
      //get the data from the server to continually update the positions
      positions = data;
    });
  };

  //the p5js draw function, runs every frame rate
  //(30-60 times / sec)
  p.draw = () => {
    p.background(0); //reset background to black
    //draw a circle for every position
    for (const id in positions) {
      const position = positions[id];
      p.circle(position.x * p.width, position.y * p.height, 10);
    }
  };
};

//initialize the sketch!
new p5(sketch, sketchContainer);

This program just lets the user click and place a circle on the screen. I think we can take
parts of this program and add it to what we have now to put this program on a server. 
 */

