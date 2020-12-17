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

const log = logger('projectManager');
// logger.setFilter('PM');
logger.setLevel(0);

const PTP_PREFIX = 'pt_project_';

export default class ProjectManager extends EventEmitter {
  private plant: NodeResult;
  private settingsManager: SettingsManager;
  public activeProjectId: string;
  private projects: { [key: string]: PlantProject } = {};
  public store: Writable<PlantProject[]> = writable([]);
  private nodeSystem: NodeSystem;

  constructor(nodeSystem: NodeSystem, settingsManager: SettingsManager) {
    super();

    this.nodeSystem = nodeSystem;

    nodeSystem.on('result', this.setProject.bind(this), 50);
    nodeSystem.on(
      'save',
      (project: PlantProject) => this.saveProject(project),
      1000,
    );

    this.setProject(nodeSystem.result as NodeResult);

    this.settingsManager = settingsManager;
    settingsManager.on('settings', this.setSettings.bind(this), 50);

    this.loadProjects();
  }

  private createNewProject(): PlantProject {
    const amountDefaultProjects = Object.values(this.projects).filter((p) =>
      /^DefaultProject((\d)+)?/.test(p.meta.name),
    ).length;

    const plant = {
      meta: {
        name:
          'DefaultProject' +
          (amountDefaultProjects ? amountDefaultProjects : ''),
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

  async updateProjectMeta(id: string, meta: Partial<PlantProjectMeta>) {
    const project = await this.getProject(id);

    project.meta = { ...project.meta, ...meta };

    this.saveProject(project);
  }

  private async saveProject(project: PlantProject) {
    this.projects[project.meta.id] = project;

    await storage.setItem('pt_project_ids', Object.keys(this.projects));

    await storage.setItem(PTP_PREFIX + project.meta.id, project);

    log('saved plant id: ', project.meta.id);

    this.store.set(Object.values(this.projects));
  }

  private async getProject(id: string): Promise<PlantProject> {
    if (id in this.projects) return this.projects[id];
    const project = (await storage.getItem(PTP_PREFIX + id)) as PlantProject;
    this.projects[id] = project;
    return project;
  }

  async deleteProject(id: string) {
    if (id in this.projects) {
      delete this.projects[id];
      await storage.removeItem(PTP_PREFIX + id);
      await storage.setItem('pt_project_ids', Object.keys(this.projects));
      this.store.set(Object.values(this.projects));
      log('deleted project with id: ' + id);
    } else {
      log.warn('cant delete project with id: ' + id);
    }
  }

  async setActiveProject(id: string) {
    if (id === this?.activeProjectId) return;
    const project = await this.getProject(id);
    if (project) {
      await storage.setItem('pt_active_id', id);
      this.activeProjectId = id;
      this.nodeSystem.load(project);
      this.saveProject(project);
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
