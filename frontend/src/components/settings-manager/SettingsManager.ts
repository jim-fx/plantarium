import './index.scss';
import { EventEmitter } from '@plantarium/helpers';
import template from './template';

function applyCurrentStateToStore(store, currentState) {
  Object.entries(currentState).forEach(([key, value = 0]) => {
    if (key in store) {
      store[key] = value === null ? 0 : value;
    }
  });
  return store;
}

export default class SettingsManager extends EventEmitter {
  constructor() {
    super();
  }

  getSettings() {
    return {} as PlantariumSettings;
  }
}
