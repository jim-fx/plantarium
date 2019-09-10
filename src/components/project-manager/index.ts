import defaultPD from "../../assets/defaultPlantDescription.json";
import importer from "../io/importer";
import incrementProjectName from "./incrementProjectName";
import logger from "../../logger";
import dataManager from "./dataManager";

dataManager();

import { version as _version } from "../../../package.json";

const version = versionToNumber(_version);
const log = logger("project manager");

//Download
const dlAnchorElem = <HTMLAnchorElement>document.getElementById("downloadAnchorElem");

const projectStore: Map<string, plantDescription | undefined> = new Map();
const metaStore: Map<string, plantMetaInfo> = new Map();

let activeProjectName: string = localStorage.activeProjectName;

//Load all saved projects from localStorage;
Object.keys(localStorage)
  .filter(k => k.includes("_pd_"))
  .forEach(k => {
    const name = k.replace("_pd_", "");
    metaStore.set(name, JSON.parse(<string>localStorage.getItem(k)).meta);
    projectStore.set(name, undefined);
  });

function versionToNumber(v: string) {
  return parseInt(v.split(".").join(""));
}

function upgradeProject(pd: plantDescription): plantDescription {
  return Object.assign(JSON.parse(JSON.stringify(defaultPD)), pd);
}

const pm = {
  updateMeta: (oldMeta: plantMetaInfo, newMeta: plantMetaInfo): string => {
    if (projectStore.has(oldMeta.name)) {
      let oldPD = <plantDescription>projectStore.get(oldMeta.name);

      if (projectStore.has(newMeta.name)) {
        newMeta.name = incrementProjectName(newMeta.name, Array.from(projectStore.keys()));
      }

      if (oldPD) {
        projectStore.delete(oldMeta.name);
        metaStore.delete(oldMeta.name);
        delete localStorage["_pd_" + oldMeta.name];
        oldPD.meta = newMeta;
        pm.save(oldPD);
      } else {
        oldPD = JSON.parse(localStorage["_pd_" + oldMeta.name]);
        oldPD.meta = newMeta;
        delete localStorage["_pd_" + oldMeta.name];
        localStorage.setItem("_pd_" + newMeta.name, JSON.stringify(oldPD));
      }
    }

    pm.setActiveProject(newMeta.name);
    return newMeta.name;
  },
  setActiveProject: (name: string) => {
    if (name === activeProjectName) return;

    //Unload old project
    if (projectStore.has(activeProjectName)) {
      projectStore.set(activeProjectName, undefined);
    }

    activeProjectName = name;

    //Load new from localStorage
    projectStore.set(activeProjectName, JSON.parse(localStorage["_pd_" + name]));

    const activePD = <plantDescription>projectStore.get(activeProjectName);
    if (activePD.meta.plantariumVersion) {
      if (versionToNumber(activePD.meta.plantariumVersion) < version) {
        log(`upgraded project ${activePD.meta.name} from version: ${activePD.meta.plantariumVersion} to version:${_version}`, 2);
        activePD.meta.plantariumVersion = _version;
        importer.init(upgradeProject(activePD));
      } else {
        importer.init(activePD);
      }
    } else {
      activePD.meta.plantariumVersion = _version;
      importer.init(activePD);
    }

    return true;
  },
  addNewProject: (name?: string) => {
    if (name) {
      //If the name is already set duplicate it
      if (projectStore.has(name)) {
        const newProject = JSON.parse(JSON.stringify(projectStore.get(name)));
        const newName = incrementProjectName(name, Array.from(projectStore.keys()));
        newProject.meta.name = newName;
        pm.save(newProject);
      } else {
        //Else create a new project from the default one
        const newProject = JSON.parse(JSON.stringify(defaultPD));
        newProject.meta.name = incrementProjectName(name, Array.from(projectStore.keys()));
        pm.save(newProject);
      }
    } else {
      const newProject = JSON.parse(JSON.stringify(defaultPD));
      if (projectStore.has(newProject.meta.name)) {
        newProject.meta.name = incrementProjectName(newProject.meta.name, Array.from(projectStore.keys()));
      }
      pm.loadProject(newProject);
    }
  },
  removeProject: (_meta: plantMetaInfo) => {
    projectStore.delete(_meta.name);
    metaStore.delete(_meta.name);
    delete localStorage["_pd_" + _meta.name];

    if (projectStore.size === 0) {
      pm.loadProject(defaultPD);
    } else if (!projectStore.has(activeProjectName)) {
      pm.setActiveProject(projectStore.keys().next().value);
    }
  },
  save: (pd: plantDescription) => {
    pd.meta.lastSaved = Date.now();
    projectStore.set(pd.meta.name, pd);
    metaStore.set(pd.meta.name, pd.meta);
    localStorage.setItem("_pd_" + pd.meta.name, JSON.stringify(pd));
  },
  loadProject: (pd: plantDescription) => {
    localStorage.setItem("_pd_" + pd.meta.name, JSON.stringify(pd));
    pm.setActiveProject(pd.meta.name);
  },
  download: (meta: plantMetaInfo) => {
    const _pd = JSON.parse(localStorage["_pd_" + meta.name]);
    const dataStr = "data:text/json;charset=utf-8," + JSON.stringify(_pd, null, 2);
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", _pd.meta.name + ".json");
    dlAnchorElem.click();
  },
  get projectNames(): string[] {
    return Array.from(projectStore.keys());
  },
  get projectMetas(): plantMetaInfo[] {
    return Array.from(metaStore.values());
  },
  get activeProjectName(): string {
    return activeProjectName;
  },
  init: () => {
    if (activeProjectName) {
      log("load project " + activeProjectName + " from localStorage", 2);
      //Load active project from localStorage
      pm.setActiveProject(activeProjectName);
    } else if (projectStore.size > 0) {
      const projectName = projectStore.keys().next().value;
      log("load project " + projectName + " from localStorage", 2);
      //Set first project active
      pm.setActiveProject(projectName);
    } else {
      log("load project default project", 2);
      pm.loadProject(defaultPD);
    }
  }
};

export default pm;
