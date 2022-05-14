import * as geometry from '../dist/index.js';
window["geometry"] = geometry;
import { getEditor, onValueChange } from './editor.js';
import * as scene from './scene.js';
import store from './store.js';
import * as examples from "./examples.js"

const exampleEl = document.getElementById("code-examples");

Object.keys(examples).forEach((k) => {
  const b = document.createElement("button");
  b.innerHTML = k;
  b.addEventListener("click", function() {
    getEditor().setValue(examples[k])
  })
  exampleEl.appendChild(b)
})


const debugEl = document.getElementById('debug');
const indecesVisibleEl = document.getElementById('show-indeces');
indecesVisibleEl.checked = store.get("indices", false);
const particlesVisibleEl = document.getElementById('show-points');
particlesVisibleEl.checked = store.get("points", false);
const wireframeVisibleEl = document.getElementById('show-wireframe');
wireframeVisibleEl.checked = store.get("wireframe", false);
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

  debugEl.innerHTML = `Time: ${Math.floor(generatorTime * 10) / 10
    }ms | Vertices: ${scene.getVertices()}`;
});
