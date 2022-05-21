import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import { setTheme } from '@plantarium/theme';
import { createToast } from '@plantarium/ui';
import { browser } from "$app/env"
import { ProjectManager } from './project-manager';
import { SettingsManager } from './settings-manager';
import Tutor from './tutor';
import * as performance from '../helpers/performance';
import { logger } from '@plantarium/helpers';
import type { PlantariumSettings } from '$lib/types';
import type { PlantProject } from '@plantarium/types';

const settingsManager = new SettingsManager();
const projectManager = new ProjectManager();

setTheme(settingsManager.get('theme'));
performance.setSettings(settingsManager.getSettings());

settingsManager.on('enableSync.update', (v) => {
  createToast(`${v ? 'Enabled' : 'Disabled'} sync`, { type: 'success' });
});

settingsManager.on('debug.logLevel.update', (logLevel) => {
  logger.setLevel(logLevel as number);
});

settingsManager.on('theme.update', (v) => {
  document.body.classList.add('transition-all');
  setTimeout(() => {
    setTheme(v as string);
    setTimeout(() => {
      document.body.classList.remove('transition-all');
    }, 400);
  }, 100);
});

const nodeSystem = new NodeSystem({
  view: browser,
  defaultNodes: false,
  registerNodes: Nodes,
  connectionColors: {
    boolean: '#f00',
    number: '#fff',
    plant: '#65e2a0',
    vec3: '#6363C7',
  },
  deferCompute: true
});

settingsManager.on('debug.showNodeUpdates.update', (v) => {
  nodeSystem.options.showUpdates = v as boolean;
});

projectManager.on('load', (project) => nodeSystem.load(project as PlantProject));

nodeSystem.on('result', () => projectManager.setProject(nodeSystem.serialize() as PlantProject), 50);

nodeSystem.on('save', (project) => {
  projectManager.saveProject(project as PlantProject)
});

settingsManager.on(
  'settings', (s) => {
    projectManager.setSettings(s as PlantariumSettings);
    performance.setSettings(s as PlantariumSettings);
  },
  50
);

Tutor.init()

export { projectManager, settingsManager, nodeSystem };
export default { projectManager, settingsManager, nodeSystem };
