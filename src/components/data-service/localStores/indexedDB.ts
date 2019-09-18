const prefix = "_pd_";

export default {
  savePlant: (pd: plantDescription) => {
    console.log(pd);
  },
  deletePlant: (meta: plantMetaInfo) => {},
  getPlant: async (meta: plantMetaInfo) => {},
  getPlantMetas: () => {
    return [{}];
  }
};
