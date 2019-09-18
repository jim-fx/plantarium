import defaultPD from "../../../assets/defaultPlantDescription.json";

const store = {
  default: defaultPD,
  default_1: Object.assign(JSON.parse(JSON.stringify(defaultPD)), {
    meta: {
      name: "default_1",
      author: "jimfx"
    }
  })
};

export default {
  savePlant: (pd: plantDescription) => {
    store[pd.meta.name] = pd;
  },
  deletePlant: (meta: plantMetaInfo) => delete store[meta.name],
  getPlant: async (meta: plantMetaInfo) => {
    if (meta.name in store) {
      return store[meta.name];
    }
  },
  getPlantMetas: () => Object.keys(store).map(k => store[k].meta)
};
