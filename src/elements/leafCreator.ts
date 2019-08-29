import "./leafCreator.scss";
import UIElement from "./element";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "../helpers/debounce";
import throttle from "../helpers/throttle";
import { Vec2 } from "ogl";
const hoverDistance = 0.1;

export default class UICurve extends UIElement {
  points: point[] = [
    {
      x: 0,
      y: 0,
      locked: true
    },
    {
      x: 0,
      y: 0,
      locked: false
    },
    {
      x: 0.617,
      y: 0.34,
      locked: false
    },
    {
      x: 0.617,
      y: 0.71,
      locked: false
    },
    {
      x: 0,
      y: 1,
      locked: false
    }
  ];
  lctx: CanvasRenderingContext2D;
  rctx: CanvasRenderingContext2D;

  private isHovered: boolean = false;
  private grd: CanvasGradient;
  private isRendering: boolean = false;
  private activePoint: point | undefined;
  private mousePos: Vec2 = new Vec2(0, 0);
  private mouseDownPos: Vec2 = new Vec2(0, 0);
  private pointDownPos: Vec2 = new Vec2(0, 0);
  private width: number = 0;
  private height: number = 0;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;
    this.wrapper.append(title);

    const leftCanvas = document.createElement("canvas");
    leftCanvas.width = 100;
    leftCanvas.height = 200;
    this.lctx = <CanvasRenderingContext2D>leftCanvas.getContext("2d");

    const rightCanvas = document.createElement("canvas");
    rightCanvas.width = 100;
    rightCanvas.height = 200;
    this.rctx = <CanvasRenderingContext2D>rightCanvas.getContext("2d");

    this.grd = this.rctx.createLinearGradient(0, 0, 0, this.height);
    this.grd.addColorStop(0, "#65e2a0");
    this.grd.addColorStop(1, "#337150");

    const update = throttle(() => {
      this.update({
        shape: this.points.map(p => {
          return {
            x: Math.floor(p.x * 1000) / 1000,
            y: Math.floor(p.y * 1000) / 1000
          };
        })
      });
    }, 100);

    const canvasWrapper = document.createElement("div");
    leftCanvas.addEventListener("mouseover", () => {
      this.isHovered = true;
      this.isRendering = true;
      this.render();
    });
    leftCanvas.addEventListener("mouseout", () => {
      this.isHovered = false;
      this.isRendering = false;
    });
    leftCanvas.addEventListener("mousemove", ev => {
      if (this.isHovered) {
        this.mousePos.x = 1 - ev.offsetX / (this.width / 2);
        this.mousePos.y = (this.height - ev.offsetY) / this.height;

        if (this.activePoint) {
          this.activePoint.x = this.pointDownPos.x + (this.mousePos.x - this.mouseDownPos.x);
          this.activePoint.y = this.pointDownPos.y + (this.mousePos.y - this.mouseDownPos.y);
          update();
        }
      }
    });
    leftCanvas.addEventListener("mousedown", ev => {
      if (this.activePoint) {
        this.points.splice(this.points.indexOf(this.activePoint), 1);
      } else {
        //Find points closest to cursor
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
          this.mouseDownPos.x = 1 - ev.offsetX / (this.width / 2);
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
          this.mouseDownPos.x = 1 - ev.offsetX / (this.width / 2);
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
    canvasWrapper.append(leftCanvas);
    canvasWrapper.append(rightCanvas);
    this.wrapper.append(canvasWrapper);

    const resizeObserver = new ResizeObserver(
      debounce(
        () => {
          const b = canvasWrapper.getBoundingClientRect();
          this.width = b.width;
          this.height = b.height;
          leftCanvas.width = b.width / 2;
          leftCanvas.height = b.height;
          rightCanvas.width = b.width / 2;
          rightCanvas.height = b.height;

          this.grd = this.rctx.createLinearGradient(0, 0, 0, this.height);
          this.grd.addColorStop(0, "#65e2a0");
          this.grd.addColorStop(1, "#337150");

          this.draw();
        },
        200,
        false
      )
    );
    resizeObserver.observe(<HTMLElement>this.wrapper);

    this.wrapper.classList.add("leaf-creator-wrapper");

    this.draw();
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      this.points = <point[]>this.config.init(pd);
    }
  }

  //Convert normalized to actual pixel/canvas coordinates
  get _points() {
    return this.points.map(p => {
      return {
        x: (1 - p.x) * (this.width / 2),
        y: this.height - p.y * this.height
      };
    });
  }

  private render = () => {
    if (this.isRendering) requestAnimationFrame(this.render);
    this.draw();
  };

  private draw() {
    //Those are still normalized, 0 > x < 1
    this.points = this.points.sort((a, b) => (a.y < b.y ? -1 : 1));

    const _points = this._points;

    this.lctx.clearRect(0, 0, this.width / 2, this.height);
    this.rctx.clearRect(0, 0, this.width / 2, this.height);
    this.lctx.lineWidth = 2;
    this.lctx.strokeStyle = "white";
    this.lctx.fillStyle = "white";

    //Draw left lines
    this.lctx.beginPath();
    this.lctx.moveTo(_points[0].x, this.height);
    this.lctx.lineTo(_points[0].x, _points[0].y);
    _points.forEach((p: point, i, a) => {
      if (i < a.length - 1) {
        this.lctx.lineTo(p.x, p.y);
      }
    });
    this.lctx.lineTo(_points[_points.length - 1].x, _points[_points.length - 1].y);
    this.lctx.lineTo(this.width / 2, _points[_points.length - 1].y);
    this.lctx.stroke();

    if (this.isHovered) {
      _points.forEach((p: point, i: number) => {
        //Need to get the normalized position to get distance from mousePos
        const mouseDistance = Math.abs(this.points[i].x - this.mousePos.x) + Math.abs(this.points[i].y - this.mousePos.y);
        this.lctx.beginPath();

        if (!p.locked) {
          if (mouseDistance < hoverDistance) {
            this.lctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            this.lctx.fillStyle = "white";
            this.lctx.fill();
          } else {
            this.lctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
            this.lctx.fillStyle = "#4b4b4b";
            this.lctx.fill();

            this.lctx.arc(p.x, p.y, 4, 0, 2 * Math.PI);
            this.lctx.lineWidth = 2;
            this.lctx.stroke();
          }
        }
      });
    }

    //Draw green leaf
    this.rctx.beginPath();
    this.rctx.moveTo(0, this.height);
    this.rctx.lineTo(this.width / 2 - _points[0].x, this.height);
    this.rctx.lineTo(this.width / 2 - _points[0].x, _points[0].y);
    _points.forEach((p, i) => {
      if (i > 0) {
        this.rctx.lineTo(this.width / 2 - p.x, p.y);
      }
    });
    this.rctx.lineTo(0, _points[_points.length - 1].y);

    this.rctx.closePath();
    this.rctx.fillStyle = this.grd;
    this.rctx.fill();
  }
}
