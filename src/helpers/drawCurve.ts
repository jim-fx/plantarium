function mousePositionOnCanvas(e) {
  var el = e.target,
    c = el;
  var scaleX = c.width / c.offsetWidth || 1;
  var scaleY = c.height / c.offsetHeight || 1;

  if (!isNaN(e.offsetX)) return { x: e.offsetX * scaleX, y: e.offsetY * scaleY };

  var x = e.pageX,
    y = e.pageY;
  do {
    x -= el.offsetLeft;
    y -= el.offsetTop;
    el = el.offsetParent;
  } while (el);
  return { x: x * scaleX, y: y * scaleY };
}

function drawPoint(ctx, x, y, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

// given an array of x,y's, return distance between any two,
// note that i and j are indexes to the points, not directly into the array.
function dista(arr, i, j) {
  return arr[2 * i] - arr[2 * j];
  return Math.sqrt(Math.pow(arr[2 * i] - arr[2 * j], 2) + Math.pow(arr[2 * i + 1] - arr[2 * j + 1], 2));
}

// return vector from i to j where i and j are indexes pointing into an array of points.
function va(arr, i, j) {
  return [arr[2 * j] - arr[2 * i], arr[2 * j + 1] - arr[2 * i + 1]];
}

function ctlpts(x1, y1, x2, y2, x3, y3) {
  const t = 0.5;
  var v = va(arguments, 0, 2);
  var d01 = dista(arguments, 0, 1);
  var d12 = dista(arguments, 1, 2);
  var d012 = d01 + d12;
  return [
    x2 - (v[0] * t * d01) / d012,
    y2 - (v[1] * t * d01) / d012,
    x2 + (v[0] * t * d12) / d012,
    y2 + (v[1] * t * d12) / d012
  ];
}

function drawControlPoints(ctx, cps) {
  for (var i = 0; i < cps.length; i += 4) {
    showPt(ctx, cps[i], cps[i + 1], "pink");
    showPt(ctx, cps[i + 2], cps[i + 3], "pink");
    drawLine(ctx, cps[i], cps[i + 1], cps[i + 2], cps[i + 3], "pink");
  }
}

function drawCurvedPath(ctx, cps, pts) {
  var len = pts.length / 2; // number of points
  if (len < 2) return;
  if (len == 2) {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    ctx.lineTo(pts[2], pts[3]);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(pts[0], pts[1]);
    // from point 0 to point 1 is a quadratic
    ctx.quadraticCurveTo(cps[0], cps[1], pts[2], pts[3]);
    // for all middle points, connect with bezier
    for (var i = 2; i < len - 1; i += 1) {
      // console.log("to", pts[2*i], pts[2*i+1]);
      ctx.bezierCurveTo(
        cps[(2 * (i - 1) - 1) * 2],
        cps[(2 * (i - 1) - 1) * 2 + 1],
        cps[2 * (i - 1) * 2],
        cps[2 * (i - 1) * 2 + 1],
        pts[i * 2],
        pts[i * 2 + 1]
      );
    }
    ctx.quadraticCurveTo(cps[(2 * (i - 1) - 1) * 2], cps[(2 * (i - 1) - 1) * 2 + 1], pts[i * 2], pts[i * 2 + 1]);
    ctx.strokeStyle = "width";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function showPt(ctx, x, y, fillStyle: string) {
  ctx.save();
  ctx.beginPath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.restore();
}

function drawLine(ctx: CanvasRenderingContext2D, x1, y1, x2, y2, strokeStyle) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  if (strokeStyle) {
    ctx.save();
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.save();
    ctx.strokeStyle = "pink";
    ctx.stroke();
    ctx.restore();
  }
}

function drawPoints(ctx, pts) {
  for (var i = 0; i < pts.length; i += 2) {
    showPt(ctx, pts[i], pts[i + 1], "black");
  }
}

function plotCBez(ptCount, pxTolerance, Ax, Ay, Bx, By, Cx, Cy, Dx, Dy) {
  let deltaBAx = Bx - Ax;
  let deltaCBx = Cx - Bx;
  let deltaDCx = Dx - Cx;
  let deltaBAy = By - Ay;
  let deltaCBy = Cy - By;
  let deltaDCy = Dy - Cy;
  let ax, ay, bx, by;
  let lastX = -10000;
  let lastY = -10000;
  let pts = [{ x: Ax, y: Ay }];
  for (let i = 1; i < ptCount; i++) {
    let t = i / ptCount;
    let ax = Ax + deltaBAx * t;
    let bx = Bx + deltaCBx * t;
    let cx = Cx + deltaDCx * t;
    ax += (bx - ax) * t;
    bx += (cx - bx) * t;
    //
    ay = Ay + deltaBAy * t;
    by = By + deltaCBy * t;
    let cy = Cy + deltaDCy * t;
    ay += (by - ay) * t;
    by += (cy - by) * t;
    let x = ax + (bx - ax) * t;
    let y = ay + (by - ay) * t;
    let dx = x - lastX;
    let dy = y - lastY;
    if (dx * dx + dy * dy > pxTolerance) {
      pts.push({ x: x, y: y });
      lastX = x;
      lastY = y;
    }
  }
  pts.push({ x: Dx, y: Dy });
  return pts;
}

function arrayFromPoints(pts) {
  const sampled = [];

  for (let i = 0; i < pts.length - 7; i += 8) {
    sampled.push(
      ...plotCBez(
        20,
        100,
        pts[i + 0],
        pts[i + 1],
        pts[i + 2],
        pts[i + 3],
        pts[i + 4],
        pts[i + 5],
        pts[i + 6],
        pts[i + 7]
      )
    );
  }

  return sampled;
}

export default function drawSplines(ctx: CanvasRenderingContext2D, _pts: point[]) {
  let cps: number[] = []; // There will be two control points for each "middle" point, 1 ... len-2e
  let pts = _pts
    .map(p => {
      return [p.x, p.y];
    })
    .flat();

  for (var i = 0; i < _pts.length - 2; i += 1) {
    cps = cps.concat(ctlpts(_pts[i].x, _pts[i].y, _pts[i + 1].x, _pts[i + 1].y, _pts[i + 2].x, _pts[i + 2].y));
  }

  drawControlPoints(ctx, cps);
  //drawPoints(ctx, pts);
  drawCurvedPath(ctx, cps, pts);

  const sampled = arrayFromPoints(pts);
  ctx.fillStyle = "black";
  sampled.forEach((p, i) => {
    ctx.fillText(i, p.x, p.y);
    //ctx.fillRect(p.x, p.y, 4, 4);
  });
}
