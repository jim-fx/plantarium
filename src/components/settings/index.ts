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
  if ("settings" in localStorage) {
    obj = JSON.parse(localStorage["settings"]);
    Object.keys(obj).forEach(k => {
      settings.set(k, obj[k]);
    });
  } else {
    localStorage.setItem("settings", "{}");
  }

  if (!settings.get("theme") && matchMedia("(prefers-color-scheme: dark)")) {
    settings.set("theme", "dark");
    obj["theme"] = "dark";
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
  get object(): settings {
    return obj;
  }
};
