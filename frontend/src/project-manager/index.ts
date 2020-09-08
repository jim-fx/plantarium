import { EventEmitter } from '@plantarium/helpers';
import { NodeSystem } from '@plantarium/nodesystem';
import SettingsView from '../settings-view';

export default class ProjectManager extends EventEmitter {
  private plant: NodeResult;
  private settings: PlantariumSettings;

  constructor(nodeSystem: NodeSystem, settingsUI: SettingsView) {
    super();
    nodeSystem.on('result', this.setPlant.bind(this), 50);
    this.setPlant(nodeSystem.result);

    settingsUI.on('settings', this.setSettings.bind(this), 50);
    this.setSettings(settingsUI.getSettings());
  }

  setPlant(plant: NodeResult) {
    this.plant = plant;
    this.emit('plant', plant);
  }

  getPlant() {
    return this.plant;
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = settings;
    this.emit('settings', settings);
  }

  getSettings() {
    return this.settings;
  }
}
