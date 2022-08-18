import { browser } from "$app/env";
import * as storage from '$lib/storage';
import type { PlantariumSettings } from "$lib/types";
import { cloneObject, EventEmitter, logger, validator } from '@plantarium/helpers';
import type { Project, TransferGeometry } from '@plantarium/types';
import { createToast } from '@plantarium/ui';
import * as createId from 'shortid';
import { get, writable, type Writable } from 'svelte/store';
import { renderProject } from '../../helpers';
import { fernSimple } from "./examples";

const log = logger('ProjectManager');

const PTP_PREFIX = 'pt_project_';

type EventMap = {
  "settings": PlantariumSettings,
  "plant": Project,
  "load": Project,
  "save": Project,
  "delete": string,
  "loading": void
}

function migrateToProject(p: Project | Record<string, unknown>): Project {
  if ("id" in p && !p["meta"]["lastSaved"]) return p as Project;

  const { meta, nodes } = p as unknown as Project;

  const result = {
    id: (p["id"] || meta["id"] || meta["plantId"]) as string,
    public: !!p.public,
    meta: { ...meta },
    nodes: nodes,
    author: (p.author || "") as string,
    likes: p?.likes ? p.likes as string[] : [],
    type: (p.type || 0) as number,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  delete result["meta"]["plantId"];
  delete result["meta"]["lastSaved"];

  return result;
}

export default class ProjectManager extends EventEmitter<EventMap> {

  public activeProjectId?: string;
  public activeProject: Writable<Project | undefined> = writable();

  private projects: { [key: string]: Project } = {};

  private loadingActiveProject?: Promise<Project>;

  public store: Writable<Project[]> = writable([]);

  constructor() {
    super();
    globalThis["pm"] = this;
    this.loadProjects();
  }


  private createNewProject(p?: Project): Project {
    const plant: Project = {
      id: createId(),
      likes: [],
      type: 0,
      public: false,
      meta: {
        ...(p?.meta || {
          transform: { x: 0, y: 0, s: 1 },
          name: 'DefaultProject',
        }),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: p?.nodes || [{
        "attributes": {
          "pos": {
            "x": -100,
            "y": 0
          },
          "type": "stem",
          "id": "1",
          "refs": [
            {
              "id": "0",
              "out": 0,
              "in": "input"
            }
          ]
        },
        "state": {
          "origin": {
            "x": 0,
            "y": 0,
            "z": 0
          },
          "height": 2,
          "thiccness": 0.06,
          "amount": 1
        }
      },
      {
        "attributes": {
          "pos": {
            "x": 0,
            "y": 0
          },
          "type": "output",
          "id": "0",
        },
      }
      ]
    };

    const currentProjectNames = Object.values(this.projects).map(_p => _p.meta.name);

    if (currentProjectNames.includes(plant.meta.name)) {
      const currentName = plant.meta.name.replace(/\d+$/, "");
      let i = 0;
      while (currentProjectNames.includes(plant.meta.name)) {
        plant.meta.name = currentName + i;
        i++;
      }
    }

    log('created new plant', plant);

    return plant;
  }

  public createNew(p?: Project): void {

    const project = this.createNewProject(p);

    console.log({ project });

    this.emit('new', project);

    this.projects[project.id] = project;

    this.saveProject(project);

    this.setActiveProject(project.id)
  }

  async updateProjectMeta(id: string, meta: Partial<Project["meta"]>): Promise<void> {
    const project = await this.getProject(id);

    project.meta = { ...project.meta, ...meta };

    log('update meta', id);

    this.emit('update', project);

    this.saveProject(project);
  }

  private async saveProject(_p: Project) {

    const project = cloneObject(_p);

    project.createdAt = project.createdAt.toISOString() as unknown as Date;
    project.updatedAt = new Date().toISOString() as unknown as Date;

    const errors = validator.isPlantProject(project);
    if (errors?.length) {
      createToast(errors[0], { title: "Can't save project " + project?.meta?.name || project.id, type: "warning" });
      console.log({ project, errors })
      throw new Error(errors[0]);
    }

    this.emit('save', project);

    if (!project?.meta?.thumbnail) this.renderThumbnail(project.id, { project });

    await storage.setItem('pt_project_ids', Object.keys(this.projects));

    await storage.setItem(PTP_PREFIX + project.id, project);

    log('saved plant id: ', project.id);

    this.store.set(Object.values(this.projects));
  }

  async getProject(id: string): Promise<Project> {
    if (id === this.activeProjectId) return get(this.activeProject);
    if (id in this.projects) return this.projects[id];
    const project = (await storage.getItem(PTP_PREFIX + id)) as Project;
    project.updatedAt = new Date(project.updatedAt);
    project.createdAt = new Date(project.createdAt);
    this.projects[id] = project;
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    if (id in this.projects) {
      delete this.projects[id];
      await storage.removeItem(PTP_PREFIX + id);
      await storage.setItem('pt_project_ids', Object.keys(this.projects));
      this.store.set(Object.values(this.projects));
      this.emit('delete', id);
      log('deleted project with id: ' + id);
    } else {
      log.warn('cant delete project with id: ' + id);
    }
  }

  async setActiveProject(id: string) {
    this.loadingActiveProject && (await this.loadingActiveProject);
    if (id === this.activeProjectId) return;


    this.loadingActiveProject = this.getProject(id);
    this.activeProjectId = id;
    this.emit("loading")

    const project = await this.loadingActiveProject;

    if (this.loadingActiveProject) {
      this.activeProjectId = id;
      this.saveProject(project);
      this.activeProject.set(project);
      await storage.setItem('pt_active_id', id);
      log('set active project to id: ' + id);
      this.emit('load', project);
      delete this.loadingActiveProject;
    } else {
      log.warn('cant find plant with id: ' + id);
    }
  }

  async renderThumbnail(projectId: string, { project, geo }: { project?: Project; geo?: TransferGeometry }) {

    if (!projectId || !(projectId in this.projects)) return;

    const a = performance.now();

    const thumbDataString = await renderProject({ pd: project, geo });

    if (thumbDataString) {
      const b = performance.now() - a;

      log('generated thumbnail for ' + projectId + ' in ' + Math.floor(b) + 'ms');

      this.updateProjectMeta(projectId, { thumbnail: thumbDataString })

    } else {
      log.warn('There was an error rendering a thumbnail for: ' + projectId);
    }
  }

  private async loadProjects() {
    const projectIds = ((await storage.getItem('pt_project_ids')) as string[]) || [];

    log('loaded project ids', projectIds);

    const activeProjectId = (await storage.getItem('pt_active_id')) as string;

    if (!projectIds.length && browser) {
      const project = this.createNewProject(fernSimple);
      console.log("new project", { project });
      projectIds.push(project.id);
      await this.saveProject(project);
      createToast("Because you had no projects, (yet) I loaded the Fern Simple example for you", { type: "success" });
    }

    await Promise.all(
      projectIds.map(async (id) => {
        let p = await this.getProject(id);
        p = migrateToProject(p);
        log('loaded ', id);
        this.projects[id] = p;
      })
    );

    if (activeProjectId && projectIds.includes(activeProjectId)) {
      this.setActiveProject(activeProjectId);
    } else {
      this.setActiveProject(projectIds[0]);
    }

    this.store.set(Object.values(this.projects));
  }

  async updateProject(dto: { id: string, meta?: Partial<Project["meta"]>, nodes?: Project["nodes"] }) {

    const project = await this.getProject(dto.id);

    if (dto.nodes) {
      project.nodes = dto.nodes;
    }

    if (dto.meta) {
      project.meta = { ...project.meta, ...dto.meta };
    }

    if (dto.id === this.activeProjectId) {
      this.activeProject.set(project);
      this.emit('plant', project);
    }

  }

  getActiveProject() {
    return get(this.activeProject);
  }

  setSettings(settings: PlantariumSettings) {
    this.emit('settings', settings);
  }
}
