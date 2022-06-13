// eslint-disable-next-line @typescript-eslint/triple-slash-reference
import { join, toOBJ, transferToGeometry } from '../dist/index.js';
import { Box, Camera, Mesh, Orbit, Renderer, Transform, Polyline, Vec3, Color, Program } from '../ogl.js';
import debug from './debug.js';
import createParticle from './particles.js';
import { green, Lines, NormalShader, wireframe } from './shaders.js';
import store from './store.js';

const renderer = new Renderer({
  dpr: 2,
  canvas: document.getElementById('render-canvas'),
});
const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);

const camera = new Camera(gl, { fov: 35 });
camera.position.set(5, 3, 6);
camera.lookAt([0, 0, 0]);
debug.setCamera(camera);

function resize() {
  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
}
window.addEventListener('resize', resize, false);
resize();

const scene = new Transform();
const controls = new Orbit(camera);

const particles = createParticle(gl);
particles.visible = store.get("points", false);
particles.setParent(scene);

const wireMesh = new Mesh(gl, {
  geometry: new Box(gl, { size: 0 }),
  program: wireframe(gl),
  mode: gl.LINES,
});
wireMesh.setParent(scene);
wireMesh.visible = store.get("wireframe", false);

const obj = new Mesh(gl, {
  geometry: new Box(gl, { size: 0 }),
  program: green(gl),
});
obj.setParent(scene);
debug.setModel(obj);

const polyline = new Polyline(gl, {
  points: [new Vec3(0, 0, 0), new Vec3(1, 0, 0)],
  uniforms: {
    uColor: { value: new Color('#f00') },
    uThickness: { value: 3 },
  },
});

const polyline2 = new Polyline(gl, {
  points: [new Vec3(0, 0, 0), new Vec3(0, 1, 0)],
  uniforms: {
    uColor: { value: new Color('#0f0') },
    uThickness: { value: 2 },
  },
});

const polyline3 = new Polyline(gl, {
  points: [new Vec3(0, 0, 0), new Vec3(0, 0, 1)],
  uniforms: {
    uColor: { value: new Color('#00f') },
    uThickness: { value: 4 },
  },
});

[polyline, polyline2, polyline3].forEach(l => {
  const mesh = new Mesh(gl, { geometry: l.geometry, program: l.program });
  mesh.setParent(scene)
})

requestAnimationFrame(update);
function update() {
  requestAnimationFrame(update);

  controls.update();
  renderer.render({ scene, camera });
  debug.render();
}

update();

let tempScene = [];
let geo;
export function add(o) {
  tempScene.push(o);
}

export const download = () => {
  const data = toOBJ(geo);
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  // Create a new link
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = "scene.obj";

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url)
};

export function commit() {
  if (tempScene.length) {
    geo = tempScene.length > 1 ? join(...tempScene) : tempScene[0];
    obj.geometry = wireMesh.geometry = transferToGeometry(gl, geo);
    obj.visible = !store.get("wireframe");
    if (particles.visible) {
      particles.setPositions(obj.geometry.attributes.position.data);
    }
  } else {
    obj.visible = false;
  }

  tempScene = [];
}

export function getVertices() {
  return obj.geometry.attributes.position.data.length / 3;
}

export function exportScene() {
  return downl
}

export function setParticleVisible(visible) {
  particles.visible = visible;
  store.set("points", visible)
}

export function setWireframeVisible(visible) {
  wireMesh.visible = visible;
  store.set("wireframe", visible)
}
export function setIndecesVisible(visible) {
  debug.setVisible(visible);
  store.set("indices", visible)
}
