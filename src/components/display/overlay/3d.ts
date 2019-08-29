import { Vec3, Vec2, Camera } from "ogl";

const wrapper = <HTMLElement>document.getElementById("overlay-wrapper");
const canvas = document.createElement("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
wrapper.append(canvas);

const b = wrapper.parentElement.getBoundingClientRect();
const w = b.width;
const h = b.height;
canvas.width = w;
canvas.height = h;

const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
ctx.fillStyle = "black";

let camera: Camera, points: Float32Array, l: number, visible: boolean;

export default {
  line: () => {
    if (!camera || !visible) return;

    ctx.clearRect(0, 0, w, h);

    let i;
    for (i = 0; i < l; i++) {
      const v = new Vec3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
      camera.project(v);
      ctx.font = `italic ${10 + 50 - v[2] * 50}pt Calibri`;
      ctx.fillText(i, w / 2 + (w * v[0]) / 2, h / 2 - (h * v[1]) / 2);
    }
  },
  set camera(c: Camera) {
    camera = c;
  },
  set points(p: Float32Array) {
    l = p.length / 3;
    points = p;
  },
  show: () => {
    visible = true;
    canvas.style.display = "";
  },
  hide: () => {
    visible = false;
    canvas.style.display = "none";
  },
  update: s => {}
};
