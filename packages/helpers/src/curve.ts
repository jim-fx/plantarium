import type { Point } from '@plantarium/types';
const tension = 0.4;

function plotCBez(
  ptCount: number,
  pxTolerance: number,
  Ax: number,
  Ay: number,
  Bx: number,
  By: number,
  Cx: number,
  Cy: number,
  Dx: number,
  Dy: number,
) {
  const deltaBAx = Bx - Ax;
  const deltaCBx = Cx - Bx;
  const deltaDCx = Dx - Cx;
  const deltaBAy = By - Ay;
  const deltaCBy = Cy - By;
  const deltaDCy = Dy - Cy;
  let ax, ay, bx, by;
  let lastX = -10000;
  let lastY = -10000;
  const pts = [{ x: Ax, y: Ay }];
  for (let i = 1; i < ptCount; i++) {
    const t = i / ptCount;
    ax = Ax + deltaBAx * t;
    bx = Bx + deltaCBx * t;
    const cx = Cx + deltaDCx * t;
    ax += (bx - ax) * t;
    bx += (cx - bx) * t;
    //
    ay = Ay + deltaBAy * t;
    by = By + deltaCBy * t;
    const cy = Cy + deltaDCy * t;
    ay += (by - ay) * t;
    by += (cy - by) * t;
    const x = ax + (bx - ax) * t;
    const y = ay + (by - ay) * t;
    const dx = x - lastX;
    const dy = y - lastY;
    if (dx * dx + dy * dy > pxTolerance) {
      pts.push({ x, y });
      lastX = x;
      lastY = y;
    }
  }
  pts.push({ x: Dx, y: Dy });
  return pts;
}

export function computeControlPoints(points: Point[]) {
  const length = points.length - 1;

  return points.map((p, i, a) => {
    if (i === 0) {
      //First point
      return {
        rx: a[i + 1].x * tension * 0,
        ry: p.y + (a[i + 1].y - p.y) * tension * 0,
      };
    } else if (i === length) {
      //Last point
      return {
        lx: a[i - 1].x + (p.x - a[i - 1].x) * tension * 2,
        ly: a[i - 1].y + (p.y - a[i - 1].y) * tension * 2,
      };
    } else {
      //Middle points
      const isExtremPoint =
        (p.y > a[i + 1].y && p.y > a[i - 1].y) ||
        (p.y < a[i + 1].y && p.y < a[i - 1].y);

      if (isExtremPoint) {
        return {
          lx: a[i - 1].x + (p.x - a[i - 1].x) * tension,
          ly: p.y,
          rx: p.x + (a[i + 1].x - p.x) * tension,
          ry: p.y,
        };
      } else {
        //Create vector from before and after point
        const vec = {
          x: a[i - 1].x - a[i + 1].x,
          y: a[i - 1].y - a[i + 1].y,
        };
        const vecLength = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2));
        vec.x /= vecLength;
        vec.y /= vecLength;

        const lRight = a[i + 1].x - p.x;
        const lLeft = p.x - a[i - 1].x;

        //let _lRight = Math.sqrt(Math.pow(p.x - a[i + 1].x, 2) + Math.pow(p.y - a[i + 1].y, 2));
        //let _lLeft = Math.sqrt(Math.pow(p.x - a[i - 1].x, 2) + Math.pow(p.y - a[i - 1].y, 2));

        return {
          lx: p.x + vec.x * lLeft * tension,
          ly: p.y + vec.y * lLeft * tension,
          rx: p.x - vec.x * lRight * tension,
          ry: p.y - vec.y * lRight * tension,
        };
      }
    }
  });
}

export function drawLinear(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.save();
  ctx.beginPath();
  points.forEach((p, i, a) => {
    if (i < a.length - 1) {
      ctx.strokeStyle = 'gray';
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(a[i + 1].x, a[i + 1].y);
    }
  });
  ctx.stroke();
  ctx.restore();
}

export function drawControlPoints(
  ctx: CanvasRenderingContext2D,
  points: Point[],
) {
  computeControlPoints(points).forEach((p, i) => {
    if ('rx' in p && 'ry' in p) {
      ctx.fillRect(p.rx - 1, p.ry - 1, 2, 2);
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(p.rx, p.ry);
      ctx.stroke();
    }
    if ('lx' in p && 'ly' in p) {
      ctx.fillRect(p.lx - 1, p.ly - 1, 2, 2);
      ctx.beginPath();
      ctx.moveTo(points[i].x, points[i].y);
      ctx.lineTo(p.lx, p.ly);
      ctx.stroke();
    }
  });
}

export function drawCurve(ctx: CanvasRenderingContext2D, points: Point[]) {
  const controlPoints = computeControlPoints(points);
  points.forEach((p, i, a) => {
    if (i < a.length - 1) {
      ctx.moveTo(p.x, p.y);
      ctx.bezierCurveTo(
        controlPoints[i].rx,
        controlPoints[i].ry,
        controlPoints[i + 1].lx,
        controlPoints[i + 1].ly,
        a[i + 1].x,
        a[i + 1].y,
      );
      ctx.stroke();
    }
  });
}

export function toArray(points: Point[]) {
  const length = points.length - 1;
  const seen = {};

  const controlPoints = computeControlPoints(points);

  return points
    .map((p, i, a) => {
      if (i < length) {
        return plotCBez(
          length * 20,
          0,
          p.x,
          p.y,
          controlPoints[i].rx,
          controlPoints[i].ry,
          controlPoints[i + 1].lx,
          controlPoints[i + 1].ly,
          a[i + 1].x,
          a[i + 1].y,
        );
      } else {
        return undefined;
      }
    })
    .flat()
    .filter((p: Point) => {
      if (!p) return false;
      if (p.x in seen) {
        return false;
      } else {
        seen[p.x] = true;
        return true;
      }
    });
}

export function drawSamplePoints(
  ctx: CanvasRenderingContext2D,
  points: Point[],
) {
  ctx.save();
  ctx.fillStyle = 'red';
  toArray(points).forEach((p) => {
    ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
  });
  ctx.restore();
}
