import {
  Box,
  Camera,
  Mesh,
  Orbit,
  Program,
  Renderer,
  Transform,
} from 'https://cdn.skypack.dev/ogl';
import { join, transferToGeometry } from './dist/index.js';
const vertex = /* glsl */ `
attribute vec3 position;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = /* glsl */ `
precision highp float;
varying vec3 vNormal;
void main() {
    vec3 normal = normalize(vNormal);
    float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
    gl_FragColor.rgb = vec3(0.2, 0.8, 1.0) + lighting * 0.1;
    gl_FragColor.a = 1.0;
}
`;

const renderer = new Renderer({
  dpr: 2,
  canvas: document.getElementById('render-canvas'),
});
const gl = renderer.gl;
gl.clearColor(1, 1, 1, 1);

const camera = new Camera(gl, { fov: 35 });
camera.position.set(5, 3, 6);
camera.lookAt([0, 0, 0]);

function resize() {
  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
}
window.addEventListener('resize', resize, false);
resize();

const scene = new Transform();
const controls = new Orbit(camera);

const program = new Program(gl, {
  vertex,
  fragment,
});

const torusGeometry = new Box(gl);

const obj = new Mesh(gl, { geometry: torusGeometry, program });
obj.setParent(scene);

requestAnimationFrame(update);
function update() {
  requestAnimationFrame(update);

  controls.update();
  renderer.render({ scene, camera });
}

update();

export function add(o) {
  if (o.length) {
    const geo = o.length > 1 ? join(o) : o[0];
    obj.geometry = transferToGeometry(gl, geo);
    obj.visible = true;
  } else {
    obj.visible = false;
  }
}
