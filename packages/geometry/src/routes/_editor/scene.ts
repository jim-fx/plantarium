import { calculateNormals, join, toOBJ, transferToGeometry } from '$lib';
import {
  Box,
  Camera,
  Color,
  Mesh,
  Orbit,
  Polyline,
  Renderer,
  Transform,
  Vec3,
  type OGLRenderingContext
} from 'ogl';
import debug from './debug';
import createParticle from './particles';
import { green, wireframe } from './shaders';
import store from './store';

let renderer: Renderer;
let gl: OGLRenderingContext;
let camera: Camera;
let scene: Transform;
let controls: { update: () => void };
let obj: Mesh;
let particles: ReturnType<typeof createParticle>;
let wireMesh: Mesh;

export function init(canvas: HTMLCanvasElement) {
  renderer = new Renderer({
    dpr: 2,
    canvas
  });

  gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  camera = new Camera(gl, { fov: 35 });
  camera.position.set(5, 3, 6);
  camera.lookAt([0, 0, 0]);
  debug.setCamera(camera);

  scene = new Transform();
  controls = new Orbit(camera);

  particles = createParticle(gl);
  particles.visible = store.get('points', false);
  particles.setParent(scene);

  wireMesh = new Mesh(gl, {
    geometry: new Box(gl, { width: 0 }),
    program: wireframe(gl),
    mode: gl.LINES
  });
  wireMesh.setParent(scene);
  wireMesh.visible = store.get('wireframe', false);

  obj = new Mesh(gl, {
    geometry: new Box(gl, { width: 0 }),
    program: green(gl)
  });
  obj.setParent(scene);
  debug.setModel(obj);

  const polyline = new Polyline(gl, {
    points: [new Vec3(0, 0, 0), new Vec3(1, 0, 0)],
    uniforms: {
      uColor: { value: new Color('#f00') },
      uThickness: { value: 3 }
    }
  });

  const polyline2 = new Polyline(gl, {
    points: [new Vec3(0, 0, 0), new Vec3(0, 1, 0)],
    uniforms: {
      uColor: { value: new Color('#0f0') },
      uThickness: { value: 2 }
    }
  });

  const polyline3 = new Polyline(gl, {
    points: [new Vec3(0, 0, 0), new Vec3(0, 0, 1)],
    uniforms: {
      uColor: { value: new Color('#00f') },
      uThickness: { value: 4 }
    }
  });

  [polyline, polyline2, polyline3].forEach((l) => {
    const mesh = new Mesh(gl, { geometry: l.geometry, program: l.program });
    mesh.setParent(scene);
  });

  requestAnimationFrame(update);

  window.addEventListener('resize', resize, false);
  resize();
}

function resize() {
  if (!renderer) return;
  renderer.setSize(window.innerWidth / 2, window.innerHeight);
  camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
}
resize();

function update() {
  if (!renderer) return;
  requestAnimationFrame(update);

  controls.update();
  renderer.render({ scene, camera });
  debug.render();
}

let tempScene = [];
let tempPoints = [];
let geo;
export function add(o) {
  tempScene.push(o);
}

export function point(o) {
  tempPoints.push(...o);
}

export const download = () => {
  if (!renderer) return;

  const data = toOBJ(geo);
  const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  // Create a new link
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'scene.obj';

  // Append to the DOM
  document.body.appendChild(anchor);

  // Trigger `click` event
  anchor.click();

  // Remove element from DOM
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
};

export function commit() {
  if (!renderer) return;
  if (tempScene.length) {
    geo = tempScene.length > 1 ? join(...tempScene) : tempScene[0];
    if (!geo) return;
    obj.geometry = wireMesh.geometry = transferToGeometry(gl, calculateNormals(geo));
    obj.visible = !store.get('wireframe');
    if (particles.visible) {
      particles.setPositions(obj.geometry.attributes.position.data);
    }
  } else {
    obj.visible = false;
  }
  if (tempPoints?.length) {
    const pointPosition = Float32Array.from(tempPoints);
    console.log('Set position', pointPosition);
    particles.setPositions(pointPosition);
  }

  tempScene = [];
  tempPoints = [];
}

export function getVertices() {
  if (!obj) return 0;
  return obj.geometry.attributes.position.data.length / 3;
}

export function setParticleVisible(visible: boolean) {
  if (!particles) return;
  particles.visible = visible;
}

export function setWireframeVisible(visible: boolean) {
  if (!wireMesh) return;
  wireMesh.visible = visible;
}
export function setIndecesVisible(visible: boolean) {
  if (!debug) return;
  debug.setVisible(visible);
}
