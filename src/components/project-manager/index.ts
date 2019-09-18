import defaultPD from "../../assets/defaultPlantDescription.json";
import importer from "../io/importer";
import logger from "../logger";
import dataService from "../data-service";

//Helpers
import incrementPlantName from "./incrementPlantName";
import { json as downloadJSON } from "../../helpers/download";
import versionToNumber from "./versionToNumber";
import updatePlantDefinition from "./updatePlantDefinition";
import { version as _version } from "../../../package.json";

const version = versionToNumber(_version);
const log = logger("project manager");

const plantStore: Map<string, plantDescription | undefined> = new Map();
const metaStore: Map<string, plantMetaInfo> = new Map();

let activePlantName: string = localStorage.activePlantName;
let pd: plantDescription;
let nextStage: Stage;

export default {
  updateMeta: async function(oldMeta: plantMetaInfo, newMeta: plantMetaInfo) {
    if (plantStore.has(oldMeta.name)) {
      let oldPD = <plantDescription>plantStore.get(oldMeta.name);

      if (plantStore.has(newMeta.name)) {
        newMeta.name = incrementPlantName(newMeta.name, Array.from(plantStore.keys()));
      }

      if (oldPD) {
        plantStore.delete(oldMeta.name);
        metaStore.delete(oldMeta.name);
        dataService.deletePlant(oldMeta);
        oldPD.meta = newMeta;
        this.save(oldPD);
      } else {
        oldPD = await dataService.getPlant(oldMeta);
        oldPD.meta = newMeta;
        dataService.deletePlant(oldMeta);
        dataService.savePlant(oldPD);
      }
    }

    this.setActivePlant(newMeta);
  },
  setActivePlant: async (meta: plantMetaInfo) => {
    if (meta.name === activePlantName) return;

    //Unload old project
    if (plantStore.has(activePlantName)) {
      plantStore.set(activePlantName, undefined);
    }

    activePlantName = meta.name;
    localStorage.setItem("activePlantName", name);

    const pd = await dataService.getPlant(meta);

    //Load new from database
    plantStore.set(activePlantName, pd);

    const activePD = <plantDescription>plantStore.get(activePlantName);

    if (activePD.meta.plantariumVersion) {
      if (versionToNumber(activePD.meta.plantariumVersion) < version) {
        log(`upgraded project ${activePD.meta.name} from version: ${activePD.meta.plantariumVersion} to version:${_version}`, 2);
        activePD.meta.plantariumVersion = _version;
        importer.init(updatePlantDefinition(activePD));
      } else {
        importer.init(activePD);
      }
    } else {
      activePD.meta.plantariumVersion = _version;
      importer.init(activePD);
    }

    return true;
  },
  newPlant: function(_name?: string): plantDescription {
    const plant = _name && plantStore.has(_name) ? JSON.parse(JSON.stringify(plantStore.get(_name))) : JSON.parse(JSON.stringify(defaultPD));
    this.addPlant(plant);
    this.updateUI();
    return plant;
  },
  addPlant: function(_pd: plantDescription) {
    _pd.meta.name = incrementPlantName(_pd.meta.name, Array.from(plantStore.keys()));
    dataService.savePlant(_pd);
    metaStore.set(_pd.meta.name, _pd.meta);
    this.setActivePlant(_pd.meta);
  },
  deletePlant: function(_meta: plantMetaInfo) {
    plantStore.delete(_meta.name);
    metaStore.delete(_meta.name);
    dataService.deletePlant(_meta);

    if (plantStore.size === 0) {
      this.addPlant(defaultPD);
    } else if (!plantStore.has(activePlantName)) {
      this.setActivePlant(plantStore.keys().next().value);
    }
  },
  save: (pd: plantDescription) => {
    pd.meta.lastSaved = Date.now();
    plantStore.set(pd.meta.name, pd);
    metaStore.set(pd.meta.name, pd.meta);
    dataService.savePlant(pd);
  },
  download: async (meta: plantMetaInfo) => {
    const pd = await dataService.getPlant(meta);
    downloadJSON(pd, meta.name);
  },
  get plantNames(): string[] {
    return Array.from(plantStore.keys());
  },
  get plantMetas(): plantMetaInfo[] {
    return Array.from(metaStore.values());
  },
  get activePlantName(): string {
    return activePlantName;
  },
  set pd(_pd: plantDescription) {
    pd = _pd;
    if (nextStage) {
      nextStage.pd = _pd;
    }
    this.save(_pd);
  },
  get pd() {
    return pd;
  },

  init: async function() {
    const plantMetas = await dataService.getPlantMetas();

    if (!plantMetas.length) {
      dataService.savePlant(defaultPD);
      plantStore.set(defaultPD.meta.name, defaultPD);
      metaStore.set(defaultPD.meta.name, defaultPD.meta);
      this.setActivePlant(defaultPD.meta);
    } else {
      plantMetas.forEach(meta => {
        metaStore.set(meta.name, meta);
      });
    }

    if (activePlantName) {
      //Load active project from database
      log("load project " + activePlantName, 2);
      this.setActivePlant({ name: activePlantName });
    } else if (plantStore.size > 0) {
      //Set first project active
      const projectName = plantStore.keys().next().value;
      log("load project " + projectName, 2);
      this.setActivePlant(projectName);
    } else {
      log("load project default project", 2);
      this.addPlant(defaultPD);
    }
  },
  connect: (_s: Stage) => {
    nextStage = _s;
  },
  updateUI: () => {
    pd && importer.init(pd);
  }
};
