import { wrap } from "comlink";

let data;

async function init() {
  const worker = new Worker("dataService.js");
  data = wrap(worker);
}

export default {
  savePlant: async (pd: plantDescription) => {
    if (!data) await init();
    data.savePlant(pd);
  },
  deletePlant: async (meta: plantMetaInfo) => {
    if (!data) await init();
  },
  getPlant: async (meta: plantMetaInfo): Promise<plantDescription> => {
    if (!data) await init();
    return await data.getPlant(meta);
  },
  getPlantMetas: async (): Promise<plantMetaInfo[]> => {
    if (!data) await init();
    return await data.getPlantMetas();
  }
};
