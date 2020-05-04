import { IPoint } from '@plantarium/types';

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
      pts.push({ x, y });
      lastX = x;
      lastY = y;
    }
  }
  pts.push({ x: Dx, y: Dy });
  return pts;
}

export default class Curve {
  ctx?: CanvasRenderingContext2D;

  private _points: IPoint[];

  private _controlPoints: any[];

  private _normalizedPoints: IPoint[];

  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this._points = [];
    this._controlPoints = [];
    this._normalizedPoints = [];
  }

  static arrayFromPoints(pts: IPoint[]): number[] {
    const c = new this();
    c.points = pts;
    return c.array;
  }

  get array() {
    const length = this.points.length - 1;
    const seen = {};
    return this.points
      .map((p, i, a) => {
        if (i < length) {
          return plotCBez(
            length * 20,
            0,
            p.x,
            p.y,
            this._controlPoints[i].rx,
            this._controlPoints[i].ry,
            this._controlPoints[i + 1].lx,
            this._controlPoints[i + 1].ly,
            a[i + 1].x,
            a[i + 1].y,
          );
        } else {
          return undefined;
        }
      })
      .flat()
      .filter((p: IPoint) => {
        if (!p) return false;

        const id = p.x.toString();
        if (id in seen) {
          return false;
        } else {
          seen[id] = true;
          return true;
        }
      });
    // .map((p) => Math.max(p.y, 0));
  }

  set points(pts) {
    if (this.ctx) {
      const w = this.ctx.canvas.width;
      const h = this.ctx.canvas.height;
      this._normalizedPoints = pts;
      this._points = pts
        .sort((a, b) => (a.x < b.x ? -1 : 1))
        .map((p) => {
          return {
            x: p.x * w,
            y: (1 - p.y) * h,
          };
        });
      this.computeControlPoints();

      this.draw(this.ctx);
    } else {
      this._points = pts.sort((a, b) => (a.x < b.x ? -1 : 1));
      this._normalizedPoints = this._points;
      this.computeControlPoints();
    }
  }

  get points() {
    return this._points;
  }

  computeControlPoints() {
    const tension = 0.4;
    const length = this.points.length - 1;
    this._controlPoints = this.points.map((p, i, a) => {
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
        let isExtremPoint =
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

          let lRight = a[i + 1].x - p.x;
          let lLeft = p.x - a[i - 1].x;

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

  drawLinear(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.beginPath();
    this._points.forEach((p, i, a) => {
      if (i < a.length - 1) {
        ctx.strokeStyle = 'gray';
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(a[i + 1].x, a[i + 1].y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  drawControlPoints(ctx: CanvasRenderingContext2D) {
    this._controlPoints.forEach((p, i) => {
      if ('rx' in p && 'ry' in p) {
        ctx.fillRect(p.rx - 1, p.ry - 1, 2, 2);
        ctx.beginPath();
        ctx.moveTo(this.points[i].x, this.points[i].y);
        ctx.lineTo(p.rx, p.ry);
        ctx.stroke();
      }
      if ('lx' in p && 'ly' in p) {
        ctx.fillRect(p.lx - 1, p.ly - 1, 2, 2);
        ctx.beginPath();
        ctx.moveTo(this.points[i].x, this.points[i].y);
        ctx.lineTo(p.lx, p.ly);
        ctx.stroke();
      }
    });
  }

  drawCurve(ctx: CanvasRenderingContext2D) {
    this._points.forEach((p, i, a) => {
      if (i < a.length - 1) {
        ctx.moveTo(p.x, p.y);
        ctx.bezierCurveTo(
          this._controlPoints[i].rx,
          this._controlPoints[i].ry,
          this._controlPoints[i + 1].lx,
          this._controlPoints[i + 1].ly,
          a[i + 1].x,
          a[i + 1].y,
        );
        ctx.stroke();
      }
    });
  }

  drawSamplePoints(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = 'red';
    this.array.forEach((p: IPoint) => {
      ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
    });
    ctx.restore();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    ctx.clearRect(0, 0, w, h);

    //this.drawLinear(ctx);
    this.drawCurve(ctx);
    //this.drawControlPoints(ctx);
    //this.drawSamplePoints(ctx);
  }
}
