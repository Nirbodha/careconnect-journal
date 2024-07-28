function toPixels(input) {
  return input.toString().concat("px");
};


var currentWhiteboard;
var currentMode = "none";
var currentCanvasEvents = {};
var position1 = [];
var position2 = [];

console.log("loaded!");

function loadText(element) {
  let canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = element.color;
  ctx.font = `${toPixels(element.fontsize)} ${element.font}`;
  //ctx.fillText(element.content, element.position[0], element.position[1]);
  ctx.fillText(element.content, element.position[0] - ctx.measureText(element.content).width / 2, element.position[1] + element.fontsize / 2);
};
function loadRectangle(element) {
  let canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = element.color || "grey";
  ctx.fillRect(element.position[0], element.position[1], element.size[0], element.size[1]);
};

function loadImage(element) {
  let canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.src = element.content;
  img.onload = function() {
    ctx.drawImage(img, element.position[0], element.position[1], element.size[0], element.size[1]); 
  };
};

function loadLine(element) {
  let canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = element.color || "black";
  ctx.beginPath();
  ctx.moveTo(element.start[0], element.start[1]);
  ctx.lineTo(element.end[0], element.end[1]);
  ctx.stroke();
};

function loadDrawing(element) {
  let canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
};



function loadWhiteboard(whiteboardName) {
  let canvas = document.getElementById("canvas");
  if (!canvas) {
    throw Error("This script can't be used here.");
  }
  var ctx = canvas.getContext("2d");
  var whiteboard;
  function onload(value) {
    console.log(value);
    whiteboard = JSON.parse(value);
    currentWhiteboard = whiteboard;
    success = true;
    document.title = whiteboard.name;
    for (const element of whiteboard.newElements) {
     if (element.type == "text") {
       loadText(element);
     };
     if (element.type == "rectangle") {
       loadRectangle(element);
     }
     if (element.type == "image") {
       loadImage(element);
      };
      if (element.type == "line") {
        loadLine(element);
     };
     if (element.type == "drawing") {
       loadDrawing(element.content);
     }
    }
  }
  if (localStorage.getItem("whiteboard")) {
    onload(localStorage.getItem("whiteboard"));
  }
  let packet = new XMLHttpRequest();
  packet.open("GET", /*window.location.hostname + "/" + */whiteboardName)
  packet.onload = function() {onload(this.responseText);};
  packet.send();
};

function saveWhiteBoard() {
  localStorage.setItem("whiteboard", JSON.stringify(currentWhiteboard));
};

function updateWhiteBoard(event) {
  if (!(event.button == 0)) { return; };
};

function ratingPrompt(event) {
  if (!(event.button == 0)) { return; };
};

function draw(event) {
  if (!(event.button == 0)) { return; };
};

function drawEnded(event) {
  if (!(event.button == 0)) { return; };
};

function rect(event) {
  if (!(event.button == 0)) { return; };
  let canvas = document.getElementById("canvas");
  //var ctx = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  position1 = [x, y];
};

function rectEnded(event) {
  if (!(event.button == 0) || position1 == null) { return; };
  var color = document.getElementById("colour");
  let canvas = document.getElementById("canvas");
  if (!color || !canvas) { return; };
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  position2 = [x, y];
  let element = {
    "type": "rectangle",
    "position": position1,
    "size": [position2[0] - position1[0], position2[1] - position1[1]],
    "color": "#" + color.value
  };
  currentWhiteboard.newElements.push(element);
  loadRectangle(element);
};

function circ(event) {
  if (!(event.button == 0)) { return; };
};

function circEnded(event) {
  if (!(event.button == 0)) { return; };
};

function erase(event) {
  if (!(event.button == 0)) { return; };
};

function eraseEnded(event) {
  if (!(event.button == 0)) { return; };
};

function insertImage(event) {
  if (!(event.button == 0)) { return; };
  let canvas = document.getElementById("canvas");
  //var ctx = canvas.getContext("2d");
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  position1 = [x, y];
}

function insertImageEnded(event) {
  if (!(event.button == 0) || position1 == null) { return; };
  let link = document.getElementById("imagelink");
  if (link.value == "") { alert("Write down the image link in the third text box.") ; return;};
  let canvas = document.getElementById("canvas");
  if (!link || !canvas) { return; };
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  position2 = [x, y];
  let element = {
    "type": "image",
    "position": position1,
    "size": [position2[0] - position1[0], position2[1] - position1[1]],
    "content": link.value
  };
  position1 = position2 = null
  currentWhiteboard.newElements.push(element);
  loadImage(element);
};

function insertAudio(event) {
  if (!(event.button == 0)) { return; };
};

/*function dragAround(event) {
  if (!(event.button == 0)) { return; };
};

function dragAroundEnded(event) {
  if (!(event.button == 0)) { return; };
};*/

function textEdit(event) {
  if (!(event.button == 0)) { return; };
  let color = document.getElementById("colour");
  let fontsize = document.getElementById("fontsize");
  let canvas = document.getElementById("canvas");
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  let content = prompt("Enter text:");
  if (content) {
    let element = {
       "type": "text",
       "position": [x, y],
       "content": content,
       "fontsize": parseInt(fontsize.value || "20"),
       "font": "Arial",
       "color": "#" + (color.value || "000000")
     };
    currentWhiteboard.newElements.push(element);
    loadText(element);
  };
};

function line(event) {
  if (!(event.button == 0)) { return; };
  let canvas = document.getElementById("canvas");
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  position1 = [x, y];
};

function lineEnded(event) {
  if (!(event.button == 0 || position1 == null)) { return; };
  let color = document.getElementById("colour");
  let canvas = document.getElementById("canvas");
  if (!color || !canvas) { return; };
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  position2 = [x, y];

  let element = {
    "type": "line",
    "color": "#" + (color.value || "000000"),
    "start": position1,
    "end": position2
  }
  currentWhiteboard.newElements.push(element);
  loadLine(element);
  position1 = position2 = []
};
/*function rotate(event) {
  if (!(event.button == 0)) { return; };
};

function rotateEnded(event) {
  if (!(event.button == 0)) { return; };
};*/
