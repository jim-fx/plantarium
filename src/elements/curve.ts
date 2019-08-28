import "./curve.scss";
import UIElement from "./element";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "../helpers/debounce";
import throttle from "../helpers/throttle";
import { Vec2 } from "ogl";
const hoverDistance = 0.1;

function plotCBez(ptCount: number, pxTolerance: number, Ax: number, Ay: number, Bx: number, By: number, Cx: number, Cy: number, Dx: number, Dy: number) {
  let deltaBAx = Bx - Ax;
  let deltaCBx = Cx - Bx;
  let deltaDCx = Dx - Cx;
  let deltaBAy = By - Ay;
  let deltaCBy = Cy - By;
  let deltaDCy = Dy - Cy;
  //@ts-ignore
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

class Curve {
  ctx?: CanvasRenderingContext2D;
  private _points: point[];
  private _controlPoints: any[];
  private _normalizedPoints: point[];
  constructor(ctx?: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this._points = [];
    this._controlPoints = [];
    this._normalizedPoints = [];
  }

  static arrayFromPoints(pts: point[]) {
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
          const length = this._normalizedPoints[i + 1].x - this._normalizedPoints[i].x;
          return plotCBez(length * 20, 0, p.x, p.y, this._controlPoints[i].rx, this._controlPoints[i].ry, this._controlPoints[i + 1].lx, this._controlPoints[i + 1].ly, a[i + 1].x, a[i + 1].y);
        } else {
          return undefined;
        }
      })
      .flat()
      .filter((p: point) => {
        console.log(p);
        const id = p.x.toString();
        if (id in seen) {
          return false;
        } else {
          //@ts-ignore
          seen[id] = true;
          return true;
        }
      });
  }

  set points(pts) {
    if (this.ctx) {
      const w = this.ctx.canvas.width;
      const h = this.ctx.canvas.height;
      this._normalizedPoints = pts;
      this._points = pts
        .sort((a, b) => (a.x < b.x ? -1 : 1))
        .map(p => {
          return {
            x: p.x * w,
            y: (1 - p.y) * h
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
          ry: p.y + (a[i + 1].y - p.y) * tension * 0
        };
      } else if (i === length) {
        //Last point
        return {
          lx: a[i - 1].x + (p.x - a[i - 1].x) * tension * 2,
          ly: a[i - 1].y + (p.y - a[i - 1].y) * tension * 2
        };
      } else {
        //Middle points
        let isExtremPoint = (p.y > a[i + 1].y && p.y > a[i - 1].y) || (p.y < a[i + 1].y && p.y < a[i - 1].y);
        if (isExtremPoint) {
          return {
            lx: a[i - 1].x + (p.x - a[i - 1].x) * tension,
            ly: p.y,
            rx: p.x + (a[i + 1].x - p.x) * tension,
            ry: p.y
          };
        } else {
          //Create vector from before and after point
          const vec = {
            x: a[i - 1].x - a[i + 1].x,
            y: a[i - 1].y - a[i + 1].y
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
            ry: p.y - vec.y * lRight * tension
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
        ctx.strokeStyle = "gray";
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(a[i + 1].x, a[i + 1].y);
      }
    });
    ctx.stroke();
    ctx.restore();
  }

  drawControlPoints(ctx: CanvasRenderingContext2D) {
    this._controlPoints.forEach((p, i) => {
      if ("rx" in p && "ry" in p) {
        ctx.fillRect(p.rx - 1, p.ry - 1, 2, 2);
        ctx.beginPath();
        ctx.moveTo(this.points[i].x, this.points[i].y);
        ctx.lineTo(p.rx, p.ry);
        ctx.stroke();
      }
      if ("lx" in p && "ly" in p) {
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
        ctx.bezierCurveTo(this._controlPoints[i].rx, this._controlPoints[i].ry, this._controlPoints[i + 1].lx, this._controlPoints[i + 1].ly, a[i + 1].x, a[i + 1].y);
        ctx.stroke();
      }
    });
  }

  drawSamplePoints(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = "red";
    this.array.forEach((p: point) => {
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

export default class UICurve extends UIElement {
  points: point[] = [
    {
      x: 0,
      y: 0,
      locked: true
    },
    {
      x: 1,
      y: 1,
      locked: true
    }
  ];
  ctx: CanvasRenderingContext2D;

  private isHovered: boolean = false;
  private isRendering: boolean = false;
  private activePoint: point | undefined;
  private mousePos: Vec2 = new Vec2(0, 0);
  private mouseDownPos: Vec2 = new Vec2(0, 0);
  private pointDownPos: Vec2 = new Vec2(0, 0);
  private width: number = 0;
  private height: number = 0;

  private curve: Curve;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;
    this.wrapper.append(title);

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;

    const update = throttle(() => {
      this.update({
        curve: this.points.map(p => {
          return {
            x: Math.floor(p.x * 1000) / 1000,
            y: Math.floor(p.y * 1000) / 1000
          };
        })
      });
    }, 100);

    this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
    this.curve = new Curve(this.ctx);

    const canvasWrapper = document.createElement("div");
    canvasWrapper.addEventListener("mouseover", () => {
      this.isHovered = true;
      this.isRendering = true;
      this.render();
    });
    canvasWrapper.addEventListener("mouseout", () => {
      this.isHovered = false;
      this.isRendering = false;
    });
    canvasWrapper.addEventListener("mousemove", ev => {
      if (this.isHovered) {
        this.mousePos.x = ev.offsetX / this.width;
        this.mousePos.y = (this.height - ev.offsetY) / this.height;

        if (this.activePoint) {
          this.activePoint.x = this.pointDownPos.x + (this.mousePos.x - this.mouseDownPos.x);
          this.activePoint.y = this.pointDownPos.y + (this.mousePos.y - this.mouseDownPos.y);
          update();
        }
      }
    });
    canvasWrapper.addEventListener("mousedown", ev => {
      if (this.activePoint) {
        this.points.splice(this.points.indexOf(this.activePoint), 1);
      } else {
        const _points = this.points
          .map((p, i) => {
            return {
              i: i,
              d: Math.abs(p.x - this.mousePos.x) + Math.abs(p.y - this.mousePos.y)
            };
          })
          .sort((a, b) => {
            return a.d < b.d ? -1 : 1;
          });

        if (_points[0].d < hoverDistance && !this.points[_points[0].i].locked) {
          this.activePoint = this.points[_points[0].i];
          this.pointDownPos.x = this.activePoint.x;
          this.pointDownPos.y = this.activePoint.y;
          this.mouseDownPos.x = ev.offsetX / this.width;
          this.mouseDownPos.y = (this.height - ev.offsetY) / this.height;
        } else {
          const point = {
            x: this.mousePos.x,
            y: this.mousePos.y,
            locked: false
          };
          this.activePoint = point;
          this.pointDownPos.x = this.activePoint.x;
          this.pointDownPos.y = this.activePoint.y;
          this.mouseDownPos.x = ev.offsetX / this.width;
          this.mouseDownPos.y = (this.height - ev.offsetY) / this.height;
          this.points.push(point);
        }
      }

      update();
    });
    document.addEventListener("mouseup", () => {
      setTimeout(() => {
        this.activePoint = undefined;
      }, 100);
    });

    canvasWrapper.classList.add("canvas-wrapper");
    canvasWrapper.append(canvas);
    this.wrapper.append(canvasWrapper);

    const resizeObserver = new ResizeObserver(
      debounce(
        () => {
          const b = canvasWrapper.getBoundingClientRect();
          this.width = b.width;
          this.height = b.height;
          canvas.width = b.width;
          canvas.height = b.height;
          this.draw();
        },
        200,
        false
      )
    );
    resizeObserver.observe(<HTMLElement>this.wrapper);

    this.wrapper.classList.add("curve-wrapper");

    this.draw();
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      const initValue = this.config.init(pd);
      if (initValue) {
        this.points = <point[]>initValue;
      }
    }
  }

  private render = () => {
    if (this.isRendering) requestAnimationFrame(this.render);
    this.draw();
  };

  private draw() {
    this.points = this.points.sort((a, b) => (a.x > b.x ? -1 : 1));

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = "white";
    this.ctx.fillStyle = "white";

    this.curve.points = this.points;

    if (this.isHovered) {
      this.points.forEach((p: point) => {
        this.ctx.beginPath();

        const mouseDistance = Math.abs(p.x - this.mousePos.x) + Math.abs(p.y - this.mousePos.y);

        if (!p.locked) {
          if (mouseDistance < hoverDistance) {
            this.ctx.arc(p.x * this.width, (1 - p.y) * this.height, 5, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
          } else {
            this.ctx.arc(p.x * this.width, (1 - p.y) * this.height, 4, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#4b4b4b";
            this.ctx.fill();

            this.ctx.arc(p.x * this.width, (1 - p.y) * this.height, 4, 0, 2 * Math.PI);
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
          }
        }
      });
    }
  }
}
