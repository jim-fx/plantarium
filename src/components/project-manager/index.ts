import defaultPD from "../../assets/defaultPlantDescription.json";
import importer from "../io/importer";
import logger from "../logger";
import data from "../data-service";

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

export default {
  updateMeta: async function(oldMeta: plantMetaInfo, newMeta: plantMetaInfo) {
    if (plantStore.has(oldMeta.name)) {
      let oldPD = <plantDescription>plantStore.get(oldMeta.name);

      if (plantStore.has(newMeta.name)) {
        newMeta.name = incrementPlantName(
          newMeta.name,
          Array.from(plantStore.keys())
        );
      }

      if (oldPD) {
        plantStore.delete(oldMeta.name);
        metaStore.delete(oldMeta.name);
        data.deletePlant(oldMeta);
        oldPD.meta = newMeta;
        this.save(oldPD);
      } else {
        oldPD = await data.getPlant(oldMeta);
        oldPD.meta = newMeta;
        data.deletePlant(oldMeta);
        data.savePlant(oldPD);
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

    const pd = await data.getPlant(meta);

    //Load new from database
    plantStore.set(activePlantName, pd);

    const activePD = <plantDescription>plantStore.get(activePlantName);

    if (activePD.meta.plantariumVersion) {
      if (versionToNumber(activePD.meta.plantariumVersion) < version) {
        log(
          `upgraded project ${activePD.meta.name} from version: ${activePD.meta.plantariumVersion} to version:${_version}`,
          2
        );
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
  addPlant: function(name?: string) {
    if (name) {
      //If the name is already set duplicate it
      if (plantStore.has(name)) {
        const newPlant = JSON.parse(JSON.stringify(plantStore.get(name)));
        const newName = incrementPlantName(name, Array.from(plantStore.keys()));
        newPlant.meta.name = newName;
        this.save(newPlant);
      } else {
        //Else create a new project from the default one
        const newPlant = JSON.parse(JSON.stringify(defaultPD));
        newPlant.meta.name = incrementPlantName(
          name,
          Array.from(plantStore.keys())
        );
        this.save(newPlant);
      }
    } else {
      const newPlant = JSON.parse(JSON.stringify(defaultPD));
      if (plantStore.has(newPlant.meta.name)) {
        newPlant.meta.name = incrementPlantName(
          newPlant.meta.name,
          Array.from(plantStore.keys())
        );
      }
      this.loadPlant(newPlant);
    }
  },
  deletePlant: function(_meta: plantMetaInfo) {
    plantStore.delete(_meta.name);
    metaStore.delete(_meta.name);
    data.deletePlant(_meta);

    if (plantStore.size === 0) {
      this.loadPlant(defaultPD);
    } else if (!plantStore.has(activePlantName)) {
      this.setActivePlant(plantStore.keys().next().value);
    }
  },
  save: (pd: plantDescription) => {
    pd.meta.lastSaved = Date.now();
    plantStore.set(pd.meta.name, pd);
    metaStore.set(pd.meta.name, pd.meta);
    data.savePlant(pd);
  },
  loadPlant: function(pd: plantDescription) {
    data.savePlant(pd);
    this.setActivePlant(pd.meta);
  },
  download: async (meta: plantMetaInfo) => {
    const pd = await data.getPlant(meta);
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
    this.save(_pd);
  },
  get pd() {
    return pd;
  },
  init: async function() {
    //Await for the initialization of sw
    const plantMetas = await data.getPlantMetas();

    if (!plantMetas.length) {
      data.savePlant(defaultPD);
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
      this.loadPlant(defaultPD);
    }
  },
  updateUI: () => {
    pd && importer.init(pd);
  }
};
