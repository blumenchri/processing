let scene = 0;
let r = 100;
let T1;
let S1 = [];
let R1 = [];
let rectop;
let inApp = false;
let mousePosition,
  speed = 0;
let radius = 160;
let maxRadius;
let img_0, img_1;

function setup() {
  createCanvas(512, 483);
  T1 = new Tree();
  for (let i = 0; i < 150; i++) {
    S1[i] = new Star();
  }
  for (let i = 0; i < 5; i++) {
    R1[i] = new Rectangle(height, width, radius, 6, 12, (i * radius) / (5 * 2));
  }
  rectop = height / 2;
  maxRadius = sqrt(sq(width / 2) + sq(height / 2));
}
function preload() {
  img_0 = loadImage("phone.png");
  img_1 = loadImage("treeBackground.png");
}
function draw() {
  switch (scene) {
    case 0:
      image(img_0, 0, 0);
      break;
    case 1:
      push();
      image(img_1, 0, 0);
      T1.drawTree();
      pop();
      break;
    case 2:
      push();
      background(0);
      for (let i = 0; i < S1.length; i++) {
        S1[i].show();
        S1[i].update();
      }
      speed = mouseDistance();
      pop();
      break;
    case 3:
      sunColor(20);
      let radius = 160;
      let maxRadius = sqrt(sq(width / 2) + sq(height / 2));
      for (let i = 0; i < R1.length; i++) {
        R1[i].drawRectangle();
        R1[i].update();
      }
      sunBackground(radius, maxRadius);
      break;
  }
}
function sunBackground(r, mr) {
  for (let i = 0; i < mr - r; i++) {
    noFill();
    stroke(0);
    strokeWeight(20);
    ellipse(width / 2, height / 2, (r + i) * 2, (r + i) * 2);
  }
}
function sunColor(s) {
  let numStripes = s; // Number of stripes in the gradient
  for (let i = 0; i < numStripes; i++) {
    // Calculate the Y position of each stripe
    noStroke();
    let y = map(i, 0, numStripes, 0, height); // Interpolate the color from yellow to red
    let lerpAmt = map(i, 0, numStripes, 0, 1);
    let c = lerpColor(color(255, 0, 0), color(255, 130, 0), lerpAmt);
    fill(c); // Draw each stripe
    rect(0, y, width, height / numStripes + 2);
  }
}
function keyPressed() {
  if (key == "a" || key == "A") {
    if (inApp == false) {
      scene = 1;
      inApp = true;
    }
  }
  if (key == "b" || key == "B") {
    if (inApp == false) {
      scene = 2;
      inApp = true;
    }
  }
  if (key == "c" || key == "C") {
    if (inApp == false) {
      scene = 3;
      inApp = true;
    }
  }
}
function mousePressed() {
  // to progress with switch statement
  inApp = false;
  scene = 0;
} //

function mouseDistance() {
  // Calculate the distance from the mouse to the center of the window
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  let v = map(d, 0, sqrt(sq(width / 2) + sq(height / 2)), 1, 20);
  return v;
} //swaying factorial tree, inspired by coding train tutorial on factorial tree designs
class Tree {
  constructor() {
    this.startSize = 240;
    this.s = 4;
    this.angle1 = 0;
    this.angle2 = 0;
  }

  drawTree() {
    //rect(0, 0, width, height); // initiate rectangle
    translate(width / 2, height / 2 + this.startSize);
    this.angle1 = map(mouseX, 0, height, 0, (2 / 3) * PI); // map angle between branches
    this.angle2 = map(mouseX, 0, width, -HALF_PI, (2 / 3) * PI);
    this.fractalBranch(150);
  }

  fractalBranch(lineSize) {
    line(0, 0, 0, -lineSize);
    strokeWeight((this.s * lineSize) / 100); // strokeweight changing while the tree is swaying
    if (lineSize > 1) {
      push();
      translate(0, -lineSize);
      rotate(this.angle2);
      this.fractalBranch(lineSize * 0.7);
      pop();
      push();
      translate(0, -lineSize);
      rotate(this.angle1);
      this.fractalBranch(lineSize * 0.7);
      pop();
    }
  }
}

class Star {
  constructor() {
    this.x = random(-width / 2, width / 2);
    this.y = random(-height / 2, height / 2);
    this.z = random(-width / 2, height / 2); //random ratio of location, star spreading out to the edges
  }
  update() {
    this.z = this.z - speed; // speed of the star fanning out, larger number = faster speed

    if (this.z < speed) {
      this.z = random(width);
      this.x = random(-width / 2, width / 2);
      this.y = random(-height / 2, height) / 2; // stars reappearing as they fan out
    }
  }
  show() {
    fill(255);
    noStroke();
    let sx = map(this.x / this.z, -0.5, 0.5, -width / 2, width / 2); // map the star values
    let sy = map(this.y / this.z, -0.5, 0.5, -height / 2, height / 2);
    let p = map(this.z, 0, width, 8, 0); //map the stars, closer means larger stars

    ellipse(sx + width / 2, sy + height / 2, p, p); // size of the stars
  }
} //i did the sun at first in another file with rectangles as object
class Rectangle {
  // reverse rectangle going up on top of the sun
  constructor(canvasHeight, canvasWidth, sunRadius, speed, rectHeight, offset) {
    this.x = 0; // this function references y, h for later uses
    this.yIni = canvasHeight / 2 + sunRadius - rectHeight;
    this.y = canvasHeight / 2 + sunRadius - rectHeight + offset;
    this.w = canvasWidth;
    this.h = this.hIni = rectHeight;
    this.speed = speed;
    this.targetY = canvasHeight / 2;
    this.delay = 1;
    this.delayCounter = 0;
  }
  drawRectangle() {
    let alpha = map(this.y, this.yIni, this.targetY, 225, 50);
    fill(0, 0, 0, alpha);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
  update() {
    if (this.y <= this.targetY) {
      this.y = this.yIni;
      this.h = this.hIni;
    } else {
      this.handleDelay();
    }
  }

  handleDelay() {
    if (this.delayCounter < this.delay) {
      this.delayCounter++;
      return;
    } else {
      this.delayCounter = 0;
      this.y -= this.speed; //returning speed
      this.h = map(this.y, this.yIni, this.targetY, this.h, this.h / 2);
    }
  }
}
