// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../@types/ogl.d.ts"/>
import { join, transferToGeometry } from '../dist/index.js';
import { Box, Camera, Mesh, Orbit, Renderer, Transform } from '../ogl.js';
import debug from './debug.js';
import createParticle from './particles.js';
import { green, test, wireframe } from './shaders.js';
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
  mode: gl.LINE_LOOP,
});
wireMesh.setParent(scene);
wireMesh.visible = store.get("wireframe", false);

const obj = new Mesh(gl, {
  geometry: new Box(gl, { size: 0 }),
  program: test(gl),
});
obj.setParent(scene);
debug.setModel(obj);

requestAnimationFrame(update);
function update() {
  requestAnimationFrame(update);

  controls.update();
  renderer.render({ scene, camera });
  debug.render();
}

update();

let tempScene = [];

export function add(o) {
  tempScene.push(o);
}

export function commit() {
  if (tempScene.length) {
    const geo = tempScene.length > 1 ? join(...tempScene) : tempScene[0];
    console.log(geo);
    obj.geometry = wireMesh.geometry = transferToGeometry(gl, geo);
    obj.visible = true;
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
