import { NodeSystem } from '@plantarium/nodes';
import '@plantarium/nodes/public/dist/index.esm.css';
import * as nodes from './nodes';
import project from './defaultProject';

const nodeUI = new NodeSystem({
  wrapper: document.getElementById('nodesystem-wrapper'),
  view: true,
  defaultNodes: true,
  registerNodes: Object.values(nodes),
});

nodeUI.load(JSON.parse(localStorage.getItem('nodesystem')) || project);

nodeUI.on('save', (save) => {
  localStorage.setItem('nodesystem', JSON.stringify(save));
});

export default nodeUI;
