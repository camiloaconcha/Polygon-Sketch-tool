const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dragging = false;
const isShape = false;
let isDrawing = true;

var cw = (canvas.width = window.innerWidth - 100);
var ch = (canvas.height = window.innerHeight - 100);

points = [];

var shape = {};

var delta = new Object();

canvas.addEventListener("click", e => {
  let point = {
    x: e.clientX,
    y: e.clientY,
    radius: 5,
    color: "rgb(0,255,0)"
  };

  isDrawing ? points.push(point) : ctx.closePath();

  updateCircles();
});

function updateCircles() {
  points.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
  });
}

function isOnFirst(e) {
  if (e && points.length > 0) {
    if (e.x - points[0].x <= 10) {
      drawShape();
    }
  }
}

function oMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(evt.clientX - rect.left),
    y: Math.round(evt.clientY - rect.top)
  };
}

function clearBoard() {
  points = [];
  updateCircles();
}

function drawShape() {
  ctx.beginPath();
  points.forEach(p => {
    ctx.lineTo(p.x, p.y);
  });
  ctx.fillStyle = "rgb(200,0,0)";
  ctx.fill();
  ctx.closePath();

  shape.x = points[0];
  shape.y = points[points.length];



  isDrawing = false;
}

canvas.addEventListener("mousedown", function(e) {

  canvas.getBoundingClientRect()
  isDragging = true;
  isOnFirst(e);
  var mousePos = oMousePos(canvas, e);
  console.log(mousePos);

  if (ctx.isPointInPath(mousePos.x, mousePos.y)) {

    points.forEach(point => {
        if(point.x - mousePos.x <5){
          console.log("Yes");
        };
    });



  }
});
