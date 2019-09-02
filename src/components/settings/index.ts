import updateUI from "../../helpers/updateUI";
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
      updateUI();
    }
  },
  loadSettings: (_settings: settings) => {
    Object.keys(_settings).forEach(k => {
      settings.set(k, _settings[k]);
    });
    save();
    updateUI();
  },
  get object(): settings {
    return obj;
  }
};
