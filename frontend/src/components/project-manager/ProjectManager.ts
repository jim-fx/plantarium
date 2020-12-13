import { EventEmitter } from '@plantarium/helpers';
import type { NodeSystem } from '@plantarium/nodesystem';
import type { SettingsManager } from '../settings-manager';

export default class ProjectManager extends EventEmitter {
  private plant: NodeResult;
  private settings: PlantariumSettings;
  private settingsManager: SettingsManager;

  constructor(nodeSystem: NodeSystem, settingsManager: SettingsManager) {
    super();
    nodeSystem.on('result', this.setPlant.bind(this), 50);
    this.setPlant(nodeSystem.result as NodeResult);

    this.settingsManager = settingsManager;
    settingsManager.on('settings', this.setSettings.bind(this), 50);
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
    return this.settingsManager.getSettings();
  }
}
