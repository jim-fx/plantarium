import { browser } from "$app/env";
import type { PlantariumSettings } from '$lib/types';
import { logger } from '@plantarium/helpers';
import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import { setTheme } from '@plantarium/theme';
import type { Project } from '@plantarium/types';
import { createToast } from '@plantarium/ui';
import * as performance from '../helpers/performance';
import { ProjectManager } from './project-manager';
import { SettingsManager } from './settings-manager';
import Tutor from './tutor';

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
  setTheme(v as string);
});

const nodeSystem = new NodeSystem({
  view: browser,
  defaultNodes: false,
  registerNodes: Nodes,
  enableDrawing: true,
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

projectManager.on('load', (project) => nodeSystem.load(project), 100);

nodeSystem.on('result', () => {
  projectManager.updateProject(nodeSystem.serialize() as Project)
}, 50);

nodeSystem.on('save', (project: Project) => {
  projectManager.updateProject(project)
});

settingsManager.on(
  'settings', (s: PlantariumSettings) => {
    projectManager.setSettings(s);
    performance.setSettings(s);
  },
  50
);

Tutor.init()

export { projectManager, settingsManager, nodeSystem };
export default { projectManager, settingsManager, nodeSystem };
