import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import { setTheme } from '@plantarium/theme';
import { createToast } from '@plantarium/ui';
import { ProjectManager } from './project-manager';
import { SettingsManager } from './settings-manager';
import { Tutor } from './tutor';
import * as performance from '../helpers/performance';
import { logger } from '@plantarium/helpers';

const settingsManager = new SettingsManager();
const projectManager = new ProjectManager();

setTheme(settingsManager.get('theme'));
performance.setSettings(settingsManager.getSettings());

settingsManager.on('enableSync.update', (v) => {
	createToast(`${v ? 'Enabled' : 'Disabled'} sync`, { type: 'success' });
});

settingsManager.on('debug.logLevel.update', (logLevel: number) => {
	logger.setLevel(logLevel);
});

settingsManager.on('theme.update', (v: string) => {
	document.body.classList.add('transition-all');
	setTimeout(() => {
		setTheme(v);
		setTimeout(() => {
			document.body.classList.remove('transition-all');
		}, 400);
	}, 100);
});

const nodeSystem = new NodeSystem({
	view: true,
	defaultNodes: false,
	registerNodes: Nodes
});

settingsManager.on('debug.showNodeUpdates.update', (v: boolean) => {
	console.log(v);
	nodeSystem.options.showUpdates = v;
});

projectManager.on('load', (project) => nodeSystem.load(project));

nodeSystem.on('result', (p: NodeResult) => projectManager.setProject(p), 50);

nodeSystem.on('save', (project: PlantProject) => projectManager.saveProject(project));

settingsManager.on(
	'settings',
	(s: PlantariumSettings) => {
		projectManager.setSettings(s);
		performance.setSettings(s);
	},
	50
);

Tutor.init({ projectManager });

export { projectManager, settingsManager, nodeSystem };
export default { projectManager, settingsManager, nodeSystem };
