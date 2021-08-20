import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import { setTheme } from '@plantarium/theme';
import { createToast } from '@plantarium/ui';
import { ProjectManager } from './project-manager';
import { SettingsManager } from './settings-manager';
import { Tutor } from './tutor';

const settingsManager = new SettingsManager();
const projectManager = new ProjectManager();

setTheme(settingsManager.get('theme'));

settingsManager.on('enableSync.update', (v) => {
  createToast(`${v ? 'Enabled' : 'Disabled'} sync`, { type: 'success' });
});

settingsManager.on('theme.update', (v: string) => {
  setTheme(v);
});

const nodeSystem = new NodeSystem({
  view: true,
  defaultNodes: false,
  registerNodes: Nodes,
});

projectManager.on('load', (project) => {
  nodeSystem.load(project);
});

nodeSystem.on('result', (p: NodeResult) => projectManager.setProject(p), 50);
nodeSystem.on('save', (project: PlantProject) =>
  projectManager.saveProject(project),
);

settingsManager.on(
  'settings',
  (s: PlantariumSettings) => projectManager.setSettings(s),
  50,
);

Tutor.init({ projectManager });

export { projectManager, settingsManager, nodeSystem };
export default { projectManager, settingsManager, nodeSystem };
