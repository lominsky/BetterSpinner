var button;
var input;
var radius;
var label;
var names = [];
var isGenerated = false;
var spinnerAngle;
var spinnerSpeed = 0;
var selected = -1;
var hasSpun = false;
var tickSound;

function preload() {
  tickSound = loadSound('./tick.m4a');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  radius = height/2 - 20;

  label = createP('Enter Values:');
  label.position(25, 25);

  input = createInput('Alpha, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliet, Kilo, Lima, Mike, November, Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whisky, X-Ray, Yankee, Zulu');
  input.position(25, 60);

  button = createButton('Generate');
  button.position(25, 85);
  button.mousePressed(generate);

  spinnerAngle = 0;

  noStroke();
  generate();
}

function draw() {
  if(isGenerated) {
    background(255);
    drawCircle();
    spin();
    drawSelector();
    fill(0);
  } else {
    background(255);
    textAlign(CENTER);
    textSize(floor(width/27));
    text("Enter the values for the spinner and click generate.", width/2, height/2 - height/10);
    text("Click on the wheel to start the spin.", width/2, height/2);
    text("Press space to remove the selected value.", width/2, height/2 + height/10);
  }
}

function spin() {
  var distance = sqrt(sq(mouseX - width/2) + sq(mouseY - height/2))
  if(mouseIsPressed && distance < radius) {
    if(isGenerated) {
      if(spinnerSpeed == 0) {
        hasSpun = true;
        selected = -1;
        spinnerSpeed = 20;
      }
    }
  } else {
    if(spinnerSpeed > 0)
      spinnerSpeed -= .1;
    else 
      spinnerSpeed = 0;
  }
  spinnerAngle += spinnerSpeed;
  spinnerAngle = spinnerAngle%360
}

function generate() {
  hasSpun = false;
  spinnerAngle = 0;
  var n = input.value().split(",");
  for(var i = 0; i < n.length; i++) {
    if(n[i].charAt(0) == ' ')
      n[i] = n[i].slice(1);
    if(n[i].charAt(n[i].length-1) == ' ')
      n[i] = n[i].slice(0, -1);
  }
  if(n.length > 2) {
    if(n.length%2 == 1) {
      n.push("Spin Again");
    }
    names = n;
    isGenerated = true;
  }
}

function drawCircle() {
  push();
  translate(width/2, height/2);
  rotate(radians(spinnerAngle));
  var num = names.length;
  ellipse(0, 0, radius*2, radius*2);
  //Draw Segments
  for(var i = 0; i < num; i++) {
    if(i%2 == 0)
      fill(200, 0, 0);
    else
      fill(0, 0, 0);
    var rad1 = radians(360*i/num);
    var rad2 = radians(360*(i+1)/num);
    arc(0, 0, radius*2, radius*2, rad1, rad2);
  }
  pop();

  push();
  translate(width/2, height/2);
  rotate(radians(spinnerAngle));
  //Write Names
  textAlign(CENTER);
  textSize(radius/10.54);
  for(var i = 0; i < num; i++) {
    var rad3 = radians((360*(i+1)/num + 360*i/num)/2 + 3);
    push();
    var transX = (radius*2/3) * cos(rad3);
    var transY = (radius*2/3) * sin(rad3);
    translate(transX, transY);
    rotate(rad3);
    if(spinnerSpeed == 0) {
      selected = floor((360-spinnerAngle)/(360/names.length));
    } else {
      selected = -1;
    }
    if(i == selected && hasSpun)
      fill(0, 255, 0);
    else
      fill(255);
    text(names[i], 0,  0);
    pop();
  }
  fill(120);
  var numTicks = 60;
  for(var i = 0; i < numTicks; i++) {
    var rad4 = radians(i * 360/numTicks);
    ellipse(cos(rad4) * radius, sin(rad4) * radius, 10, 10);
  }
  pop();
}

function drawSelector() {
  push();
  fill(255, 255, 0);
  translate(width/2 + radius + radius / 1.7, height/2);
  if(spinnerSpeed > 1)
    rotate(-1*radians(spinnerAngle%6));
  else
    rotate(0);
  if(spinnerSpeed != 0) {
    if(floor(spinnerAngle)%6 == 0) {
      tickSound.setVolume(0.1);
      tickSound.play();
    } else if(floor(spinnerAngle)%6 == 5) {
      tickSound.stop();
    }
  }
  beginShape();
  vertex(radius / 12.7, -1 * radius / 21);
  vertex(radius / 12.7, radius / 21);
  vertex(-1 * radius / 1.5875, 0);
  vertex(-1 * radius / 1.5875, 0);
  endShape(CLOSE);
  fill(100);
  ellipse(0, 0, radius/25, radius/25);
  pop();
}

function keyPressed() {
  if(key == ' ' && selected != -1 && names.length > 2 && hasSpun) {
    names.splice(selected, 1);

    if(names[names.length-1] == "Spin Again") {
      names.splice(names.length-1, 1);
    } else {
      names.push("Spin Again");
    }

    selected = -1;
    hasSpun = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  radius = height/2 - 20;
}
