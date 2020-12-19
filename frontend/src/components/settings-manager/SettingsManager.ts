import './index.scss';
import { EventEmitter, debounce, logger } from '@plantarium/helpers';
import SettingsTemplate from './SettingsTemplate';

import storage from 'localforage';
import { writable } from 'svelte/store';

const obj = {};

const templateToSettings = (
  template: SettingsTemplate,
  store?: typeof obj,
): PlantariumSettings => {
  const settings = {} as PlantariumSettings;

  Object.entries(template).forEach(([key, _template]) => {
    const value = store && key in store ? store[key] : undefined;
    if ('options' in _template) {
      settings[key] = templateToSettings(_template.options, value);
    } else {
      settings[key] = value || (_template.defaultValue ?? _template.value);
    }
  });

  return settings;
};

const resolveDeep = (object: typeof obj, path: string[]) => {
  const current = path.shift();
  if (current && current in object) {
    if (!path.length) return object[current];
    return resolveDeep(object[current], path);
  } else {
    return;
  }
};

const keyToPath = (key: string) => (key.includes('.') ? key.split('.') : [key]);

export default class SettingsManager extends EventEmitter {
  private settings: PlantariumSettings = {} as PlantariumSettings;

  public store = writable({});

  private _save: () => void;

  constructor() {
    super();

    this._save = debounce(
      () => {
        storage.setItem('pt_settings', this.settings);
      },
      500,
      false,
    );

    this.loadFromLocal();
  }

  save() {
    this.emit('settings', this.settings);

    logger.setLevel(this.settings?.debug?.logLevel ?? 2);

    this._save();
  }

  async loadFromLocal() {
    const s =
      ((await storage.getItem('pt_settings')) as PlantariumSettings) || {};

    this.settings = templateToSettings(SettingsTemplate, s);

    logger.setLevel(this.settings?.debug?.logLevel ?? 2);

    this.store.set(this.settings);

    this.emit('settings', this.settings);
  }

  set(key: string, value: unknown) {
    const path = keyToPath(key);

    if (path.length > 1) {
      const finalKey: string = path.pop() as string;
      const obj = resolveDeep(this.settings, path);
      if (obj) {
        obj[finalKey] = value;
      }
    } else {
      this.settings[path[0]] = value;
    }

    this.save();
  }

  get(key: string) {
    return resolveDeep(this.settings, keyToPath(key));
  }

  getSettings() {
    return JSON.parse(JSON.stringify(this.settings)) as PlantariumSettings;
  }
}
