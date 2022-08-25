import * as storage from '$lib/storage';
import type { PlantariumSettings } from '$lib/types';
import { cloneObject, debounce, EventEmitter, logger } from '@plantarium/helpers';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import './index.scss';
import SettingsTemplate from './SettingsTemplate';

const obj = {};

const log = logger('SettingsManager');

const templateToSettings = (
  template: typeof SettingsTemplate,
  store?: typeof obj
): PlantariumSettings => {
  const settings = {} as PlantariumSettings;

  Object.entries(template).forEach(([key, _template]) => {
    const value = store && key in store ? store[key] : undefined;
    if (typeof _template === 'object' && 'options' in _template) {
      settings[key] = templateToSettings(_template.options, value);
    } else {
      settings[key] = value ?? _template.defaultValue ?? _template.value;
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

type EventMap = {
  "settings": PlantariumSettings,
  [key: string]: unknown
}

export default class SettingsManager extends EventEmitter<EventMap> {
  private settings: PlantariumSettings = {} as PlantariumSettings;

  public store: Writable<PlantariumSettings> = writable(this.settings);

  private _save: () => void;

  constructor() {
    super();

    log('Initialized');
    this._save = debounce(
      () => {
        storage.setItem('pt_settings', this.settings);
      },
      500,
      false
    );
  }

  save() {
    this.emit('settings', this.settings);

    logger.setLevel(this.settings?.debug?.logLevel ?? 2);
    this.store.set(this.settings);

    log('save settings', this.settings);

    this._save();
  }

  async loadFromLocal() {
    const s = ((await storage.getItem('pt_settings')) as PlantariumSettings) || {};

    this.settings = templateToSettings(SettingsTemplate, s);

    logger.setLevel(this.settings?.debug?.logLevel ?? 2);

    this.store.set(this.settings);

    log('loaded settings from local', this.settings);

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

    log(`Set ${key}`, value);

    this.emit(key + '.update', value);

    this.save();
  }

  get(key: string) {
    return resolveDeep(this.settings, keyToPath(key));
  }

  getSettings() {
    return cloneObject(this.settings);
  }
}
