let serial;

// Position
let x = 200;
let y = 200;

// Joystick
let joyX = 512;
let joyY = 512;

// Time-of-Flight sensor (speed control)
let tofValue = 0;
let speedMapped = 0;

// Direction
let angle = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  setupSerial();
}

function draw() {
  background(10);

  let dx = joyX - 512;
  let dy = -(joyY - 512); // ✅ invert Y

  let deadzone = 80;
  let magnitude = sqrt(dx * dx + dy * dy);

  if (magnitude > deadzone) {
    dx /= magnitude;
    dy /= magnitude;

    angle = atan2(dy, dx);
  }

  speedMapped = map(tofValue, 0, 1023, 0, 10);
  speedMapped = constrain(speedMapped, 0, 10);

  x += cos(angle) * speedMapped;
  y += sin(angle) * speedMapped;

  x = constrain(x, 0, width);
  y = constrain(y, 0, height);


  push();
  translate(x, y);
  rotate(angle);
  drawCar();
  pop();
-
  stroke(0, 255, 0);
  line(x, y, x + cos(angle) * 50, y + sin(angle) * 50);

  noStroke();
  fill(255);
  textSize(14);
  text("X: " + int(x), 20, 30);
  text("Y: " + int(y), 20, 50);
  text("Speed: " + speedMapped.toFixed(2), 20, 70);
  text("Angle: " + degrees(angle).toFixed(1), 20, 90);
  text("JoyX: " + int(joyX), 20, 110);
  text("JoyY: " + int(joyY), 20, 130);
  text("TOF: " + int(tofValue), 20, 150);
}


function drawCar() {
  rectMode(CENTER);

  fill(200, 50, 50);
  stroke(0);
  rect(0, 0, 100, 50, 10);

  fill(50);
  ellipse(-30, -25, 20);
  ellipse(30, -25, 20);
  ellipse(-30, 25, 20);
  ellipse(30, 25, 20);
}


function setupSerial() {
  if (typeof p5.SerialPort === "undefined") {
    console.log("Serial library not loaded");
    return;
  }

  try {
    serial = new p5.SerialPort();
    serial.list();

    serial.open('COM7'); // change if needed
    serial.on('data', gotData);

    console.log("Serial connected");
  } catch (err) {
    console.log("Serial failed:", err);
  }
}

// --- READ SERIAL ---
function gotData() {
  let currentString = serial.readLine();
  if (!currentString) return;

  currentString = currentString.trim();
  if (!currentString) return;

  let parts = currentString.split(',');

  if (parts.length === 3) {
    let jx = Number(parts[0]);
    let jy = Number(parts[1]);
    let tof = Number(parts[2]);

    if (!isNaN(jx)) joyX = jx;
    if (!isNaN(jy)) joyY = jy;
    if (!isNaN(tof)) tofValue = tof;
  }
}

// --- RESIZE ---
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}