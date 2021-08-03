import { NodeSystem } from './dist/index.esm.js';
import nodes from './nodes.js';
import { dev, stressTest } from './projects.js';

const system = new NodeSystem({
  view: true,
  wrapper: document.getElementById('nodesystem-wrapper'),
  defaultNodes: true,
  registerNodes: nodes,
});
window.system = system;

system.on('save', (save) => {
  localStorage.setItem('system-' + system.id, JSON.stringify(save));
});

const nodeData = localStorage.getItem('system-0')
  ? JSON.parse(localStorage.getItem('system-0') || '{}')
  : dev;

window.addEventListener('keydown', (ev) => {
  if (document.activeElement.tagName === 'BODY') {
    if (ev.key === 'S' && ev.shiftKey) system.load(stressTest);
    if (ev.key === 'D' && ev.shiftKey) system.load(dev);
  }
});

system.load(nodeData);
