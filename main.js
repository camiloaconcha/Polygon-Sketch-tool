const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// create circles to draw
circles = [];

canvas.addEventListener('click', e => {
  let point = {
    x: e.clientX,
    y: e.clientY,
    radius: 5,
    color: 'rgb(0,255,0)'
  };
  let mousePos = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  };

  circles.push(point);
  updateCircles();
});

function updateCircles() {
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = circle.color;
    ctx.fill();
  });

  isInFirstPoint(circles[0], mousePos);
}

function clearBoard() {
  circles = [];
  updateCircles();
}

function joinPoints() {
  circles.forEach(p => {
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  });
}


function isInFirstPoint(mouse,point){
    
   console.log(mouse);
   console.log('===');
   console.log(point);

}
