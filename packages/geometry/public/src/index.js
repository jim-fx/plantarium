import * as geometry from '../dist/index.js';
import { onValueChange } from './editor.js';
import * as scene from './scene.js';

const debugEl = document.getElementById('debug');
const indecesVisibleEl = document.getElementById('show-indeces');
const particlesVisibleEl = document.getElementById('show-points');
const wireframeVisibleEl = document.getElementById('show-wireframe');
particlesVisibleEl.addEventListener('input', () => {
  scene.setParticleVisible(particlesVisibleEl.checked);
});

indecesVisibleEl.addEventListener('input', () => {
  scene.setIndecesVisible(indecesVisibleEl.checked);
});
wireframeVisibleEl.addEventListener('input', () => {
  scene.setWireframeVisible(wireframeVisibleEl.checked);
});
onValueChange((v) => {
  let generatorTime = 0;
  try {
    const a = performance.now();
    eval(`(g,scene) => {${v}\n}`)(geometry, scene);
    generatorTime = performance.now() - a;
  } catch (error) {
    // eslint-disable-next-line no-empty
    console.log(error.message);
  } finally {
    scene.commit();
  }

  debugEl.innerHTML = `Time: ${
    Math.floor(generatorTime * 10) / 10
  }ms | Vertices: ${scene.getVertices()}`;
});
