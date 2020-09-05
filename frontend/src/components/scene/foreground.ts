import { PlantariumSettings, PlantDescription } from '@plantarium/types';
import { Mesh, Box, Program, Color, Vec2 } from 'ogl';
import { Scene, ProjectManager } from 'components';
import { plant, transferToGeometry } from '@plantarium/generator';
import { BasicShader } from './shaders';

export default class ForegroundScene {
  private scene: Scene;
  private pm: ProjectManager;

  private plant: PlantDescription;
  private settings: PlantariumSettings;

  private gl: WebGL2RenderingContext;

  private mesh: Mesh;

  constructor(scene: Scene, pm: ProjectManager) {
    this.scene = scene;
    this.gl = scene.renderer.gl;
    this.pm = pm;

    this.initGeometry();

    this.setSettings(pm.getSettings());
    this.setPlant(pm.getPlant());

    this.pm.on('settings', this.setSettings.bind(this));
    this.pm.on('plant', this.setPlant.bind(this));
  }

  initGeometry() {
    const geometry = new Box(this.scene.gl);
    const program = new Program(this.gl, {
      vertex: BasicShader.vertex,
      fragment: BasicShader.fragment,
    });
    this.mesh = this.scene.addMesh(geometry, program);
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = JSON.parse(JSON.stringify(settings));
    this.update();
  }

  setPlant(plant: PlantDescription) {
    this.plant = plant ? JSON.parse(JSON.stringify(plant)) : plant;
    console.log(this.plant);
    this.update();
  }

  update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    const geo = plant(p, s);

    this.mesh.geometry = transferToGeometry(this.gl, geo);
  }
}
