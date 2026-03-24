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
 * Updated Movement with Bounce off walls. 
 * Working on bounce off other items.
 * Uses Circles because thats where i am in my brain right now
 * 
let theta = 0;
let speedBlue = 0;

let xBluePos = 200;
let yBluePos = 200;

let bouncing = false;
let bounceTimer = 0;

function draw() {
  background(0);

  updateDirection();
  updateSpeed();
  moveCar();
  checkBounce();
  updateBounceTimer();

  ellipse(xBluePos, yBluePos, 32, 32);
}

function updateDirection() {
  if (bouncing) return;

  let jx = map(joyX, 0, 1024, -1, 1);
  let jy = map(joyY, 0, 1024, -1, 1);

  theta = atan2(jy, jx);
}

function updateSpeed() {
  speedBlue = map(blueTOF, 0, 2000, 0, 100);
}

function moveCar() {
  xBluePos += cos(theta) * speedBlue * 0.1;
  yBluePos += sin(theta) * speedBlue * 0.1;
}

function checkBounce() {
  let r = 16;

  if (xBluePos > width - r || xBluePos < r ||
      yBluePos > height - r || yBluePos < r) {

    bouncing = true;
    bounceTimer = 20;

    theta += Math.PI; // reverse direction
  }
}

function updateBounceTimer() {
  if (bouncing) {
    bounceTimer--;
    if (bounceTimer <= 0) bouncing = false;
  }
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



/**
 * Alyssa's Idea for a class to create standardized cars based off rectangles
 * Styling can be added to these by someone more skilled than me
 * This class includes bouncing off walls (to be removed but it was where i 
 * started with the whole bouncing thing), bouncing off other cars, changing direction
 * and speed, and a collission check that is mostly just vibes.
 * I can not test so none of it may work.
 * You have been warned.
 * 
 *class Car {

  carRect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;   //Width
    this.h = h;   //Height

    this.theta = 0;   //Direction angle
    this.speed = 0;   //Movement speed

    this.bouncing = false;   
    this.bounceTimer = 0; 
  }

  setDirection(jx, jy) {
    if (this.bouncing) return; 
    this.theta = atan2(jy, jx);
  }

  setSpeed(sensorValue) {
    this.speed = map(sensorValue, 0, 2000, 0, 100);
  }

  move() {
    this.x += cos(this.theta) * this.speed * 0.1;
    this.y += sin(this.theta) * this.speed * 0.1;
  }

  bounceWalls() {
    // Half sizes for collision
    let hw = this.w / 2;
    let hh = this.h / 2;

    if (this.x < hw || this.x > width - hw ||
        this.y < hh || this.y > height - hh) {

      this.theta += Math.PI;   // flip direction
      this.startBounce(); 
  }

  bounceOff(other) {
    if (this.isColliding(other)) {
      //Angle from this car to the other car
      let angle = atan2(other.y - this.y, other.x - this.x);

      // reverse each car away from the collision
      this.theta = angle + Math.PI; //Adding Math.Pi adds PI which changes direction 180 degrees
      other.theta = angle + Math.PI;

      this.startBounce();
      other.startBounce();

    }
  }

  //Collision Check
  isColliding(other) {
    return (
      abs(this.x - other.x) < (this.w/2 + other.w/2) &&
      abs(this.y - other.y) < (this.h/2 + other.h/2)
    );

    //https://www.geeksforgeeks.org/java/java-math-abs-method-examples/
  }

  startBounce() {
    this.bouncing = true;
    this.bounceTimer = 60;   //Bounce timer for Joystick overide
  }

  updateBounceTimer() {
    if (this.bouncing) {
      this.bounceTimer--;
      if (this.bounceTimer <= 0) {
        this.bouncing = false;
      }
    }
  }


}
 */