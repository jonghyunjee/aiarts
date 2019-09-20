let video;
let poseNet;
let particles = [];

let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;
let eyerX = 0;
let eyerY = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  if (poses.length > 0) {

    let nX = poses[0].pose.keypoints[0].position.x;
    let nY = poses[0].pose.keypoints[0].position.y;
    let lX = poses[0].pose.keypoints[1].position.x;
    let lY = poses[0].pose.keypoints[1].position.y;
    let rX = poses[0].pose.keypoints[2].position.x;
    let rY = poses[0].pose.keypoints[2].position.y;

//used lerp to make motions seem more natural
    noseX = lerp(noseX, nX, 0.5);
    noseY = lerp(noseY, nY, 0.5);
    eyelX = lerp(eyelX, lX, 0.5);
    eyelY = lerp(eyelY, lY, 0.5);
    eyerX = lerp(eyerX, rX, 0.5);
    eyerY = lerp(eyerY, rY, 0.5);
  }
}

function modelReady() {
  console.log('model ready');
}

function draw() {
  image(video, 0, 0);

  let d = dist(eyerX, eyerY, eyelX, eyelY);

  fill(d, d, d);
  strokeWeight(5);
  line(noseX, noseY, noseX + d, noseY + d);

  fill(d, d, d);
  ellipse(eyelX, eyelY, d + 5);

  fill(d, d, d);
  ellipse(eyerX, eyerY, d + 5);

  if (d > 3) {
  particles.push( new Particle(noseX + d, noseY + d, random(1, 3), random(-1, 1)));
}
    // update and display particles
    for (let i=0; i<particles.length; i++) {
      let p = particles[i];
      p.move();
      p.display();
    }

    // limit the number of particles
    if (particles.length > 300) {
      particles.splice(0, 1);
    }
}

class Particle {
  constructor(x, y, xspd, yspd) {
    this.x = x;
    this.y = y;
    this.xspd = xspd;
    this.yspd = yspd;
    this.size = random(5, 10);
    this.color = color(random(255), 0, 0);
  }
  display() {
    strokeWeight(0.1);
    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }
  move() {
    this.x += this.xspd;
    this.y += this.yspd;
  }
}
