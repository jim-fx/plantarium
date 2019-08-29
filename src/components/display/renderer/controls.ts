import { Vec3, Geometry } from "ogl";

export default function customControls(canvas: HTMLCanvasElement, vec: Vec3, target: Geometry) {
  let mouseDown: boolean = false;
  const downVec = {
    x: 0,
    y: 0
  };
  let downY = vec[1];
  let h = canvas.height;

  target.computeBoundingBox();
  let min = target.bounds.min[1];
  let max = target.bounds.max[1];

  canvas.addEventListener("mousedown", ev => {
    if (ev.button == 2) {
      downY = vec[1];
      h = canvas.height;
      downVec.x = ev.pageX;
      downVec.y = ev.pageY;
      mouseDown = !mouseDown;
    }
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvas.addEventListener("mousemove", ev => {
    if (mouseDown) vec[1] = Math.max(Math.min(downY + ((downVec.y - ev.pageY) / h) * 10, max), min);
  });

  return {
    resize: () => {
      target.computeBoundingBox();
      min = target.bounds.min[1];
      max = target.bounds.max[1];
    }
  };
}
