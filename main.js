const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let polygons = [],
  polygonTouch = false,
  startX = null,
  startY = null;

let isDrawing = true;

let cw = (canvas.width = window.innerWidth - 100);
let ch = (canvas.height = window.innerHeight - 300);

let points = [];
let rectss = [];
let rects = [];

canvas.addEventListener('click', e => {
  let point = {
    x: e.clientX,
    y: e.clientY,
    radius: 5
  };

  isDrawing ? points.push(point) : ctx.closePath();

  updateCircles();
});

const pointInPolygon = (x, y, points) => {
  let i,
    j = points.length - 1,
    touch = false;

  for (i = 0; i < points.length; i++) {
    const pxi = points[i].x,
      pxj = points[j].x,
      pyi = points[i].y,
      pyj = points[j].y;

    if (
      ((pyi < y && pyj >= y) || (pyj < y && pyi >= y)) &&
      (pxi <= x || pxj <= x)
    ) {
      if (pxi + ((y - pyi) / (pyj - pyi)) * (pxj - pxi) < x) {
        touch = !touch;
      }
    }
    j = i;
  }

  return touch;
};

const changeColor = () => {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const updateCircles = () => {
  points.forEach(p => {
    var i = 0;

    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = changeColor();
    ctx.fill();
    ctx.closePath();
    rects.push({
      x: p.x,
      y: p.y,
      w: 10,
      h: 10,
      index: i + 1
    });
  });
  rectss.push(rects);
};

const clearBoard = () => {
  points = [];
  polygons = [];
  rects = [];
  ctx.clearRect(0, 0, cw, ch);
};

const rectForEach = (rects, x, y, down) => {
  rects.forEach((rect, i) => {
    if (down) {
      if (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h
      ) {
        rect.down = true;
      }
    } else {
      if (
        x >= rect.x &&
        x <= rect.x + rect.w &&
        y >= rect.y &&
        y <= rect.y + rect.h &&
        rect.down
      ) {
        rect.touch = true;
      }
    }
  });

  return rects;
};

const drawShape = drawingPoints => {
  if (drawingPoints) {
    ctx.clearRect(0, 0, cw, ch);
  }

  ctx.beginPath();
  points.forEach(p => {
    ctx.lineTo(p.x, p.y);
  });
  ctx.fill();
  ctx.closePath();

  updateCircles();
  rectss.push(rects);

  polygons.push({
    points: points,
    rects: points,
    polygonTouch: false
  });
  isDrawing = false;
};

canvas.addEventListener('mousedown', e => {
  let { clientX, clientY } = e;

  const x = clientX - 4,
    y = clientY - 4;

  polygons.forEach((polygon, i) => {
    polygons[polygons.length - 1].rects = rectForEach(
      polygons[polygons.length - 1].rects,
      x,
      y,
      true
    );
    if (pointInPolygon(x, y, polygons[i].points)) {
      const p = polygons[i];
      polygons.splice(i, 1);

      polygons.push(p);
      polygons[polygons.length - 1].polygonTouch = true;
      startX = x;
      startY = y;
    }
  });
});

canvas.addEventListener('mousemove', e => {
  let { clientX, clientY } = e;
  const x = clientX - 4,
    y = clientY - 4;

  polygons.forEach((polygon, i) => {
    polygons[i].rects = rectForEach(polygons[i].rects, x, y, false);

    const rect = polygons[i].rects.filter(r => r.touch)[0];
    if (rect) {
      if (rect.index === 0) {
        polygons[i].points[0].x = x;
        polygons[i].points[0].y = y;
        polygons[i].points[polygons[i].points.length - 1].x = x;
        polygons[i].points[polygons[i].points.length - 1].y = y;
      } else {
        polygons[i].points[rect.index].x = x;
        polygons[i].points[rect.index].y = y;
      }

      drawShape(polygons.map(({ points }) => points));
    }
    if (polygons[i].polygonTouch && !rect) {
      polygons[i].points.forEach(point => {
        point.x += x - startX;
        point.y += y - startY;
      });
      drawShape(polygons.map(({ points }) => points));
      startX = x;
      startY = y;
    }
  });
});

canvas.addEventListener('mouseout', e => {
  rects.forEach(rect => {});
});
canvas.addEventListener('mouseup', e => {
  let { clientX, clientY } = e;

  const x = clientX - 4,
    y = clientY - 4;

  polygons.forEach((polygon, i) => {
    const rect = polygons[i].rects.filter(r => r.touch)[0];

    if (polygons[i].polygonTouch && !rect) {
      polygons[i].points.forEach(point => {
        point.x += x - startX;
        point.y += y - startY;
      });

      drawShape(rect);
    }

    polygons[i].polygonTouch = false;

    if (rect) {
      polygons[i].rects[rect.index].touch = false;
      polygons[i].rects[rect.index].down = false;

      if (rect.index === 0) {
        polygons[i].points[0].x = x;
        polygons[i].points[0].y = y;
        polygons[i].points[polygons[i].points.length - 1].x = x;
        polygons[i].points[polygons[i].points.length - 1].y = y;
      } else {
        polygons[i].points[rect.index].x = x;
        polygons[i].points[rect.index].y = y;
      }

      polygons[i].rects = drawShape(polygons.map(({ points }) => points))[i];
    }
  });
});
