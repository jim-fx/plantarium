const version = '0.0.7';

import './index.scss';
import './themes.scss';

import { NodeSystem } from '@plantarium/nodesystem';
import '@plantarium/nodesystem/public/dist/index.css';

import Nodes from '@plantarium/nodes';
import { resizeTable } from '@plantarium/helpers';

import ProjectManager from './project-manager';
import SettingsView from './settings-view';
import Scene from './scene';

/*
                     +-----------+
                     |DataService|
                     +-----+-----+   Scene
                          |          -----------------
+----------+              ^          \  +---------+  \
|NodeSystem|              |          \  |Generator|  \
+----------- <-> +---------+-------> \  +----+----+  \
                 |ProjectManager|    \       |       \
+----------- <-> +-----------------> \  +----+---+   \
|SettingsUI|                         \  |Renderer|   \
+----------+                         \  +--------+   \
                                     -----------------
*/

const table = document.querySelector('table');
// Save table width to localStorage
resizeTable(table, (width: number) =>
  localStorage.setItem('plantarium-ui-width', width + ''),
);

// Read table width from localstorage
if (localStorage.getItem('plantarium-ui-width')) {
  const tableCell = table.querySelector('td');
  tableCell.style.width = localStorage.getItem('plantarium-ui-width') + 'px';
}

document.getElementById('version').innerHTML = 'v' + version;

// Initialize node system
const defaultProject = {
  meta: { transform: { x: 0, y: 0, s: 1 } },
  nodes: [
    {
      attributes: {
        pos: { x: -100, y: 0 },
        type: 'stem',
        id: '1',
        refs: [{ id: '0', in: 'main' }],
      },
    },
    {
      attributes: { pos: { x: 0, y: 0 }, type: 'output', id: '0', refs: [] },
    },
  ],
};

const nodeUI = new NodeSystem({
  wrapper: document.getElementById('nodesystem-wrapper'),
  view: true,
  defaultNodes: false,
  registerNodes: Nodes,
});

nodeUI.load(JSON.parse(localStorage.getItem('nodesystem')) || defaultProject);

nodeUI.on('save', (save) => {
  localStorage.setItem('nodesystem', JSON.stringify(save));
});

// Initialize settings view
const settingsUI = new SettingsView();

// Initialize project manager
const projectManager = new ProjectManager(nodeUI, settingsUI);

// Initialize 3D scene
new Scene(projectManager);
