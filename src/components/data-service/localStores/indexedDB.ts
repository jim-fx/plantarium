import { get, set, keys, del, Store } from "idb-keyval";

const store = new Store("plantarium", "plants");

export default {
  savePlant: async (pd: plantDescription) => {
    set(pd.meta.name, pd, store);
  },
  deletePlant: (meta: plantMetaInfo) => {
    del(meta.name, store);
  },
  getPlant: async (meta: plantMetaInfo) => {
    return await get(meta.name, store);
  },
  getPlantMetas: async () => {
    const _keys = await keys(store);
    const all = await Promise.all(_keys.map(k => get(k, store)));
    return all.map(a => a.meta);
  }
};
