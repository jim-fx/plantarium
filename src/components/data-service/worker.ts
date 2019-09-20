import db from "./localStores/indexedDB";
import sync from "./sync";
import { expose } from "comlink";

expose({
  savePlant: async (pd: plantDescription) => {
    db.savePlant(pd);
  },
  deletePlant: (meta: plantMetaInfo) => {
    db.deletePlant(meta);
  },
  getPlant: async (meta: plantMetaInfo) => {
    return await db.getPlant(meta);
  },
  getPlantMetas: async () => {
    return await db.getPlantMetas();
  },
  getID: async () => {
    return await sync.getID();
  },
  setID: async (id: string) => {
    return await sync.setID(id);
  },
  enableSync: () => {
    sync.enabled = true;
  },
  disableSync: () => {
    sync.enabled = false;
  }
});
