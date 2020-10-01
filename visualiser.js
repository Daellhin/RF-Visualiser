//[17:11:23][D][remote.raw:041]: Received Raw: -370, 680, -362, 686, -363, 686, -694, 356, -693, 356, -698, 356, -694, 355
const canvasHeight = 150;
const xMoveAmount = 6;

let visualisations = [];
let scale = 10;
let inputCache = "";

function addMousePressedHandler(btn, funct) {
  var myHoverInterval = null;

  btn.onmousedown = () => {
    if (myHoverInterval != null) {
      return;
    }
    myHoverInterval = setInterval(funct, 1);
  };

  btn.onmouseup = () => {
    if (myHoverInterval != null) {
      clearInterval(myHoverInterval);
      myHoverInterval = null;
    }
  };
}

class Visualisation {
  constructor(input, index) {
    this._input = input;
    this._raw = this.convertInput(input);
    this._mirror = true;
    this._startX = 0;
    this._index = index;

    // creating canvas
    this._canvas = document.createElement("canvas");
    this._canvas.width = window.innerWidth-20;
    this._canvas.height = canvasHeight;
    
    this._canvas.onmouseover = () => {
      const input = document.getElementById("input");
      inputCache = input.value;
      input.value = this._input;
    }
    this._canvas.onmouseout = () => {
      const input = document.getElementById("input");
      input.value = inputCache;
    }

    // creating graphicsContext
    this._ctx = this._canvas.getContext("2d");
    this._ctx.strokeStyle = "black";
    this._ctx.lineWidth = 1.5;
    this._ctx.textAlign = "end";
  }

  convertInput(input) {
    return input.trim().split(", ");
  }

  toHtml() {
    const div = document.createElement("div");
    const btnLeft = document.createElement("button");
    const btnRight = document.createElement("button");
    const btnMirror = document.createElement("button");
    const btnRemove = document.createElement("button");

    div.id = "visualisation" + this._index;
    btnLeft.className = "visualisationButton";
    btnRight.className = "visualisationButton";
    btnMirror.className = "visualisationButton";
    btnRemove.className = "visualisationButton";

    btnLeft.innerHTML = "Left";
    btnRight.innerHTML = "Right";
    btnMirror.innerHTML = "Mirror";
    btnRemove.innerHTML = "Remove";

    addMousePressedHandler(btnLeft, () => this.moveCanvasLeft());
    addMousePressedHandler(btnRight, () => this.moveCanvasRight());
    btnMirror.onclick = () => this.mirrorCanvas();
    btnRemove.onclick = () => this.removeHtml();

    div.appendChild(this._canvas);
    div.appendChild(document.createElement("p"));
    div.appendChild(btnLeft);
    div.appendChild(btnRight);
    div.appendChild(btnMirror);
    div.appendChild(btnRemove);
    div.appendChild(document.createElement("p"));

    document.getElementById("visualisations").insertAdjacentElement("afterbegin",div);
  }

  removeHtml() {
    document.getElementById("visualisation" + this._index).remove();
  }

  draw() {
    const center = canvasHeight / 2 - 0;
    const graphHeight = canvasHeight / 2 - 20;
    let xDistance = this._startX;
    let baseline = this._mirror;

    this._ctx.beginPath();

    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.moveTo(xDistance, center - (baseline ? 0 : graphHeight));

    this._raw.forEach((e) => {
      xDistance += Math.abs(e) / scale;
      this._ctx.lineTo(xDistance, center - (baseline ? 0 : graphHeight));
      this._ctx.lineTo(xDistance, center - (!baseline ? 0 : graphHeight));
      this._ctx.rotate(-Math.PI / 2);
      this._ctx.fillText(e, -center - 15, xDistance + 8);
      this._ctx.rotate(Math.PI / 2);
      baseline = !baseline;
    });

    this._ctx.stroke();
  }

  moveCanvasLeft() {
    if (this._startX < 0) {
      this._startX += xMoveAmount;
      this.draw();
    }
  }

  moveCanvasRight() {
    this._startX -= xMoveAmount;
    this.draw();
  }

  mirrorCanvas() {
    this._mirror = !this._mirror;
    this.draw();
  }

  resizeCanvas(){
    this._canvas.width = window.innerWidth-20;
  }
}

function createVisualisation() {
  const input = document.getElementById("input");
  let inputValue = input.value;
  input.value = "";
  let visualisation = new Visualisation(inputValue, visualisations.length);
  visualisation.toHtml();
  visualisation.draw();

  visualisations.push(visualisation);
}

function init() {
  let btnStart = document.getElementById("start");
  btnStart.addEventListener("click", createVisualisation);

  addMousePressedHandler(document.getElementById("left"), () => {
    visualisations.forEach((e) => {
      e.moveCanvasLeft();
    });
  });
  addMousePressedHandler(document.getElementById("right"), () => {
    visualisations.forEach((e) => {
      e.moveCanvasRight();
    });
  });
  document.getElementById("mirror").onclick = () => {
    visualisations.forEach((e) => {
      e.mirrorCanvas();
    });
  };
  document.getElementById("clear").onclick = () => {
    visualisations.forEach((e) => {
      e.removeHtml();
    });
  };
  document.getElementById("scale").oninput = function () {
    scale = this.value;
    visualisations.forEach((e) => {
      e.draw();
    });
  };

  window.addEventListener('resize', () => {
    visualisations.forEach((e) => {
      e.resizeCanvas();
    });
  });
}

window.onload = init;