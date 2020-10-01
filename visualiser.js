//[17:11:23][D][remote.raw:041]: Received Raw: -370, 680, -362, 686, -363, 686, -694, 356, -693, 356, -698, 356, -694, 355
const height = 70;
const xMoveAmount = 6;

let raw;
let flipped = false;
let startX = 0;

class Visualisation{
  constructor(input) {
    this._mirror = false;
    this._input = input;
    this._raw = this.convertInput(input);
  }

  convertInput(input){
    input.trim();
  }
}

function start() {
  input = document.getElementById("input").value.trim();

  if (input.indexOf("Received Raw: ") > 0) {
    let start = input.indexOf("Received Raw: ");
    raw = input.substring(start + "Received Raw: ".length, input.length);
  } else {
    raw = input;
  }

  document.getElementById("inputP").innerHTML = input;
  document.getElementById("rawP").innerHTML = raw;

  draw();
}

function mirror() {
  if (raw != null) {
    flipped = !flipped;
    draw();
  }
}

function draw() {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");

  let xDistance = startX;
  let baseline = flipped;

  ctx.fillStyle = "black";

  // graph
  ctx.beginPath();
  ctx.clearRect(0, 0, 3000, 3000);
  ctx.moveTo(startX, 200 - (baseline ? 0 : height));

  toArray(raw).forEach((e) => {
    xDistance += Math.abs(e) / 10;
    ctx.lineTo(xDistance, 200 - (baseline ? 0 : height));
    ctx.lineTo(xDistance, 200 - (!baseline ? 0 : height));
    baseline = !baseline;
  });

  ctx.stroke();
}

function moveLeft() {
  console.log(startX);
  if (startX < 0) {
    startX += xMoveAmount;
    draw();
  }
}

function moveRight() {
  startX -= xMoveAmount;
  draw();
}

function toArray(input) {
  let output = [];
  input.split(", ").forEach((e) => {
    output.push(e.trim());
  });
  return output;
}

function init() {
  // document.getElementById("input").addEventListener("keyup", start);
  document.getElementById("start").addEventListener("click", start);
  document.getElementById("mirror").addEventListener("click", mirror);

  var myHoverInterval = null;
  var btn = document.getElementById("right");

  btn.addEventListener("mouseover", function () {
    if (myHoverInterval != null) {
      return;
    }
    myHoverInterval = setInterval(function () {
      moveRight();
    }, 1);
  });

  btn.addEventListener("mouseout", function () {
    if (myHoverInterval != null) {
      clearInterval(myHoverInterval);
      myHoverInterval = null;
    }
  });

  var myHoverIntervalLeft = null;
  var btn = document.getElementById("left");

  btn.addEventListener("mouseover", function () {
    if (myHoverInterval != null) {
      return;
    }
    myHoverIntervalLeft = setInterval(function () {
      moveLeft();
    }, 1);
  });

  btn.addEventListener("mouseout", function () {
    if (myHoverIntervalLeft != null) {
      clearInterval(myHoverIntervalLeft);
      myHoverIntervalLeft = null;
    }
  });
}
window.onload = init;

//https://stackoverflow.com/questions/26096403/css-js-move-viewport-on-the-right-side-of-the-screen
