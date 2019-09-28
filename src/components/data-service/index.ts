import { wrap } from "comlink";
import overlay from "../overlay";

let data;

async function init() {
  const worker = new Worker("dataService.js");
  data = wrap(worker);
  worker.addEventListener("message", ev => {
    if (ev.data && ev.data.type === "overlay") {
      overlay.popup(ev.data.value.msg, ev.data.value.type);
    }
  });
}

export default {
  savePlant: async (pd: plantDescription) => {
    if (!data) await init();
    return await data.savePlant(pd);
  },
  deletePlant: async (meta: plantMetaInfo) => {
    if (!data) await init();
    return await data.deletePlant(meta);
  },
  getPlant: async (meta: plantMetaInfo): Promise<plantDescription> => {
    if (!data) await init();
    return await data.getPlant(meta);
  },
  getPlantMetas: async (): Promise<plantMetaInfo[]> => {
    if (!data) await init();
    return await data.getPlantMetas();
  },
  getID: async () => {
    if (!data) await init();
    return await data.getID();
  },
  setID: async (id: string) => {
    if (!data) await init();
    return await data.setID(id);
  },
  enableSync: async () => {
    if (!data) await init();
    return await data.enableSync();
  },
  disableSync: async () => {
    if (!data) await init();
    return await data.disableSync();
  }
};
