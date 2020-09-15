import './index.scss';
import { EventEmitter } from 'packages/helpers';
import template from './template';
import SettingsUI from 'settings-ui';

function applyCurrentStateToStore(store, currentState) {
  Object.entries(currentState).forEach(([key, value = 0]) => {
    if (key in store) {
      store[key] = value === null ? 0 : value;
    }
  });
  return store;
}

export default class SettingsView extends EventEmitter {
  private store: PlantariumSettings = {} as PlantariumSettings;

  private ui = SettingsUI();
  private visible = false;
  private wrapper = document.getElementById('settings-wrapper');

  constructor() {
    super();

    const initState =
      'settings' in localStorage
        ? JSON.parse(localStorage.getItem('settings'))
        : {};

    this.store = applyCurrentStateToStore(this.ui.bind(template), initState);

    this.ui.addChangeListener(() => this.save());

    this.ui.render().to(this.wrapper);

    this.ui.update();

    document.getElementById('button-settings').addEventListener('click', () => {
      this.visible ? this.hide() : this.show();
    });
  }

  getSettings() {
    return this.store;
  }

  private save() {
    localStorage.setItem('settings', JSON.stringify(this.store));
    this.emit('settings', this.store);
  }

  private show() {
    this.visible = true;
    this.wrapper.classList.add('settings-visible');
  }

  private hide() {
    this.visible = false;
    this.wrapper.classList.remove('settings-visible');
  }
}
