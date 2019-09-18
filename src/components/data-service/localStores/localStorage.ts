const prefix = "_pd_";

export default {
  savePlant: (pd: plantDescription) => {
    localStorage.setItem("_pd_" + pd.meta.name, JSON.stringify(pd));
  },
  deletePlant: (meta: plantMetaInfo) => localStorage.removeItem(prefix + meta.name),
  getPlant: async (meta: plantMetaInfo) => {
    const metaName = prefix + meta.name;
    if (metaName in localStorage) {
      return JSON.parse(localStorage[metaName]);
    }
  },
  getPlantMetas: () =>
    Object.keys(localStorage)
      .filter(k => k.includes(prefix))
      .map(k => JSON.parse(localStorage[k]).meta)
};
