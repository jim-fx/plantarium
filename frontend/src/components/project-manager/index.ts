import { EventEmitter } from '@plantarium/helpers';
import { PlantDescription, PlantariumSettings } from '@plantarium/types';
import { NodeSystem } from '@plantarium/nodesystem';
import settingsUI from 'components/settings';

export default class ProjectManager extends EventEmitter {
  private plant: PlantDescription;
  private settings: PlantariumSettings;

  constructor(nodeSystem: NodeSystem, settingsUi: typeof settingsUI) {
    super();
    nodeSystem.on('result', this.setPlant.bind(this), 50);
    this.setPlant(nodeSystem.result);

    settingsUi.on('settings', this.setSettings.bind(this), 50);
    this.setSettings(settingsUI.getSettings());
  }

  setPlant(plant: PlantDescription) {
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
