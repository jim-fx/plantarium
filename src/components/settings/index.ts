const settings: Map<string, any> = new Map();

let obj: any = {};

const save = () => {
  obj = {};
  settings.forEach((v, k) => {
    obj[k] = v;
  });
  localStorage.setItem("settings", JSON.stringify(obj));
};

const load = () => {
  if ("pdSettings" in localStorage) {
    obj = JSON.parse(localStorage["settings"]);
    Object.keys(obj).forEach(k => {
      settings.set(k, obj[k]);
    });
  } else {
    localStorage.setItem("settings", "{}");
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
    }
  },
  loadSettings: (_settings: settings) => {
    Object.keys(_settings).forEach(k => {
      settings.set(k, _settings[k]);
    });
    save();
  },
  get object(): settings {
    return obj;
  }
};
