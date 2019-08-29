import importer from "../io/importer";
import exporter from "../io/exporter";
const settings: Map<string, any> = new Map();

let obj: any = {};

const save = () => {
  obj = {};
  settings.forEach((v, k) => {
    obj[k] = v;
  });
  localStorage.setItem("pdSettings", JSON.stringify(obj));
};

const load = () => {
  if ("pdSettings" in localStorage) {
    obj = JSON.parse(localStorage["pdSettings"]);
    Object.keys(obj).forEach(k => {
      settings.set(k, obj[k]);
    });
  } else {
    localStorage.setItem("pdSettings", "{}");
  }
};

load();

export default {
  get: (key: string) => {
    return settings.get(key);
  },
  set: (key: string, value: any) => {
    const old = settings.get(key);

    if (old !== value) {
      settings.set(key, value);
      save();
      importer.init(exporter.pd);
    }
  },

  get object(): settings {
    return obj;
  }
};
