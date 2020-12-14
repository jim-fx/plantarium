import { EventEmitter, logger } from '@plantarium/helpers';
import type { NodeSystem } from '@plantarium/nodesystem';
import type { SettingsManager } from '../settings-manager';
import { Writable, writable } from 'svelte/store';
import storage from 'localforage';
import createId from 'shortid';

//@ts-ignore
window.clearAll = () => {
  storage.clear();
};
//@ts-ignore
window.getAll = async () => {
  const keys = await storage.keys();
  const values = await Promise.all(keys.map((key) => storage.getItem(key)));

  keys.forEach((key, i) => {
    console.log(key, values[i]);
  });
};

const log = logger('PM');
logger.setFilter('PM');
logger.setLevel(0);

const PTP_PREFIX = 'pt_project_';

export default class ProjectManager extends EventEmitter {
  private plant: NodeResult;
  private settingsManager: SettingsManager;
  public activeProject: PlantProject;
  private projects: { [key: string]: PlantProject } = {};
  public store: Writable<PlantProject[]> = writable([]);
  private nodeSystem: NodeSystem;

  constructor(nodeSystem: NodeSystem, settingsManager: SettingsManager) {
    super();

    this.nodeSystem = nodeSystem;

    nodeSystem.on('result', this.setProject.bind(this), 50);
    this.setProject(nodeSystem.result as NodeResult);

    this.settingsManager = settingsManager;
    settingsManager.on('settings', this.setSettings.bind(this), 50);

    this.loadProjects();
  }

  private createNewProject(): PlantProject {
    const plant = {
      meta: {
        name: 'DefaultProject',
        id: createId(),
        transform: { x: 0, y: 0, s: 1 },
      },
      nodes: [
        {
          attributes: {
            pos: { x: -100, y: 0 },
            type: 'stem',
            id: '1',
            refs: [{ id: '0', in: 'main', out: 0 }],
          },
        },
        {
          attributes: {
            pos: { x: 0, y: 0 },
            type: 'output',
            id: '0',
            refs: [],
          },
        },
      ],
    };

    log('created new plant', plant);

    return plant;
  }

  public createNew() {
    const plant = this.createNewProject();
    this.saveProject(plant);
  }

  private async saveProject(plant: PlantProject) {
    this.projects[plant.meta.id] = plant;

    await storage.setItem('pt_project_ids', Object.keys(this.projects));

    await storage.setItem(PTP_PREFIX + plant.meta.id, plant);

    log('saved plant id: ', plant.meta.id);

    this.store.set(Object.values(this.projects));
  }

  private async getProject(id: string): Promise<PlantProject> {
    return storage.getItem(PTP_PREFIX + id);
  }

  async setActiveProject(id: string) {
    if (id === this?.activeProject?.meta.id) return;
    const project = await this.getProject(id);
    if (project) {
      await storage.setItem('pt_active_id', id);

      if (this.activeProject) {
        this.activeProject.meta.active = false;
        this.saveProject(this.activeProject);
      }
      this.activeProject = project;
      this.activeProject.meta.active = true;
      this.saveProject(this.activeProject);
      this.nodeSystem.load(project);
      log('set active project to id: ' + id);
    } else {
      log.warn('cant find plant with id: ' + id);
    }
  }

  private async loadProjects() {
    const projectIds =
      ((await storage.getItem('pt_project_ids')) as string[]) || [];

    log(projectIds);

    const activeProjectId = (await storage.getItem('pt_active_id')) as string;

    if (!projectIds.length) {
      const plant = this.createNewProject();
      projectIds.push(plant.meta.id);
      await this.saveProject(plant);
    }

    await Promise.all(
      projectIds.map(async (id) => {
        const p = await this.getProject(id);
        log('loaded ', id);
        this.projects[id] = p;
      }),
    );

    if (activeProjectId && projectIds.includes(activeProjectId)) {
      this.setActiveProject(activeProjectId);
    } else {
      this.setActiveProject(projectIds[0]);
    }

    console.log(this.projects);
    this.store.set(Object.values(this.projects));
  }

  setProject(plant: NodeResult) {
    this.plant = plant;
    this.emit('plant', plant);
  }

  getActiveProject() {
    return this.plant;
  }

  setSettings(settings: PlantariumSettings) {
    this.emit('settings', settings);
  }

  getSettings() {
    return this.settingsManager.getSettings();
  }
}
