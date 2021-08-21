import { Vec3 } from '../ogl.js';

const canvas = document.getElementById('debug-canvas');

const w = window.innerWidth / 2;
const h = window.innerHeight;

canvas.width = w;
canvas.height = h;

const ctx = canvas.getContext('2d');
let camera,
  model,
  visible = false;

ctx.fillStyle = 'red';
ctx.fillRect(0, 0, 50, 50);

function setCamera(cam) {
  camera = cam;
}

function setVisible(vis) {
  visible = vis;
  canvas.display = vis ? 'block' : 'none';
}

function setModel(m) {
  model = m;
}

function render() {
  if (!camera) return;

  ctx.clearRect(0, 0, w, h);

  if (model && visible) {
    const points = model?.geometry?.attributes?.position?.data;

    if (!points) return;

    const pointsL = points.length / 3;

    for (let i = 0; i < pointsL; i++) {
      const v = new Vec3(points[i * 3], points[i * 3 + 1], points[i * 3 + 2]);
      camera.project(v);
      ctx.font = '30px Arial';
      ctx.fillText(i.toString(), (w + w * v[0]) / 2, (h - h * v[1]) / 2);
    }
  }
}

export default {
  render,
  setModel,
  setVisible,
  setCamera,
};
