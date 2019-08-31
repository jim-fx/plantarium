import { Vec3, Camera } from "ogl";

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
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillStyle = "black";
ctx.font = `italic 10pt Calibri`;

let camera: Camera;

let visible: boolean;

let points: Float32Array;
let pointsL: number;
let showIndeces: boolean;

let skeleton: Float32Array[];
let skeletonL: number;
let showSkeleton: boolean;

export default {
  draw: () => {
    if (!camera || !visible) return;

    ctx.clearRect(0, 0, w, h);

    if (showIndeces && pointsL) {
      let i;
      for (i = 0; i < pointsL; i++) {
        const v = new Vec3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
        camera.project(v);
        ctx.fillText(i.toString(), (w + w * v[0]) / 2, (h - h * v[1]) / 2);
      }
    }

    if (showSkeleton && skeletonL) {
      //Loop though each skeleton
      for (let i = 0; i < skeletonL; i++) {
        //Loop through each point along the skeleton
        const l = skeleton[i].length / 3;
        for (let j = 0; j < l; j++) {
          const v = new Vec3(skeleton[i][j * 3], skeleton[i][j * 3 + 1], skeleton[i][j * 3 + 2]);
          camera.project(v);

          //Convert from normalized coordinates to screen space
          const x = (w + w * v[0]) / 2;
          const y = (h - h * v[1]) / 2;
          ctx.fillRect(x - 2, y - 2, 4, 4);

          if (j === 0) {
            ctx.beginPath();
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    }
  },
  set camera(c: Camera) {
    camera = c;
  },
  set points(p: Float32Array) {
    points = p;
    pointsL = p.length / 3;
  },
  set skeleton(s: Float32Array[]) {
    skeleton = s;
    skeletonL = s.length;
  },
  show: () => {},
  hide: () => {},
  update: (s: settings) => {
    if (s["debug_indices"] || s["debug_skeleton"]) {
      visible = true;
      canvas.style.display = "";

      showIndeces = !!s["debug_indices"];
      showSkeleton = !!s["debug_skeleton"];
    } else {
      visible = false;
      canvas.style.display = "none";
    }
  }
};
