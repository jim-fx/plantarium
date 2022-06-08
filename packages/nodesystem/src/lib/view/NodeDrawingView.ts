import type NodeSystemView from "./NodeSystemView";


export default class NodeDrawingView {

  private wrapper: SVGElement;

  points: number[];
  lines: number[][] = [];

  activeLineEl: SVGPolylineElement;


  constructor(private system: NodeSystemView) {

    this.wrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.wrapper.classList.add("nodesystem-drawing-wrapper");
    this.wrapper.style.zIndex = "5"
    this.wrapper.style.pointerEvents = "none"
    this.wrapper.style.overflow = "visible"
    this.wrapper.style.position = "absolute"
    this.wrapper.style.left = "0px"
    this.wrapper.style.top = "0px"
    this.system.transformWrapper.appendChild(this.wrapper);

    system.on("mousemove", (ev) => this.handleMouseMove(ev));
    system.on("mousedown", (ev) => {
      if (ev.keys.ctrlKey && ev.keys.shiftKey) {
        this.wrapper.style.pointerEvents = "all";
        this.startNewLine(ev as any)
      }
    })
    system.on("mouseup", () => this.endLine())

  }

  endLine() {
    this.wrapper.style.pointerEvents = "none"
    if (!this.activeLineEl) return
    const p = this.points;
    this.lines.push(p);
    const el = this.activeLineEl;
    el.addEventListener("mouseover", (ev) => {
      if (ev.altKey && ev.ctrlKey) {
        el.remove()
      }
    })
    this.points = undefined;
  }

  handleMouseMove({ x, y }: NodeSystemView["eventMap"]["mousemove"]) {
    if (!this.points) return;
    let lastX = this.points[this.points.length - 2]
    let lastY = this.points[this.points.length - 1]
    if ((Math.abs(lastX - x) + Math.abs(lastY - y)) < 5) {
      return;
    }
    this.points.push(Math.floor(x));
    this.points.push(Math.floor(y));

    let s = ""
    for (let i = 0; i < this.points.length; i += 2) {
      s += this.points[i] + "," + this.points[i + 1] + " "
    }
    this.activeLineEl.setAttribute("points", s);
  }


  startNewLine({ x, y }) {
    this.points = [x, y];
    this.activeLineEl = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    this.activeLineEl.style.strokeWidth = "2px";
    this.activeLineEl.style.stroke = "var(--accent, white)"
    this.activeLineEl.style.fill = "none"
    this.wrapper.appendChild(this.activeLineEl)
  }
}
