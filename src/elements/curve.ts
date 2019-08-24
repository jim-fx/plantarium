import "./curve.scss";
import UIElement from "./element";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "../helpers/debounce";
import drawCurve from "../helpers/drawCurve";
const hoverDistance = 0.1;

export default class UICurve extends UIElement {
  points: point[] = [
    {
      x: 0,
      y: 0,
      locked: true
    },
    {
      x: 0.25,
      y: 0.25,
      locked: false
    },
    {
      x: 0.5,
      y: 0.5,
      locked: false
    },
    {
      x: 0.75,
      y: 0.75,
      locked: false
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
  private mousePos: Vector = {
    x: 0,
    y: 0
  };
  private mouseDownPos: Vector = {
    x: 0,
    y: 0
  };
  private pointDownPos: Vector = {
    x: 0,
    y: 0
  };
  private width: number = 0;
  private height: number = 0;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;
    this.wrapper.append(title);

    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;

    this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

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
    });

    document.addEventListener("mouseup", () => {
      setTimeout(() => {
        this.activePoint = undefined;
      }, 100);
    });

    canvasWrapper.classList.add("canvas-wrapper");
    canvasWrapper.append(canvas);
    this.wrapper.append(canvasWrapper);

    const resize = debounce(
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
    );
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(<HTMLElement>this.wrapper);
    resize();

    this.wrapper.classList.add("curve-wrapper");

    this.draw();
    window["curve"] = this;
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

    //this.ctx.moveTo(this.points[0].x * this.width, (1 - this.points[0].y) * this.height);

    drawCurve(
      this.ctx,
      this.points.map(p => {
        return {
          x: Math.floor(this.width * p.x),
          y: Math.floor(this.height * (1 - p.y))
        };
      })
    );

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
