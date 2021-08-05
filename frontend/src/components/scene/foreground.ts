import { plant } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import { Box, Mesh } from 'ogl';
import type Scene from '.';
import type { ProjectManager } from '../project-manager';
import DebugScene from './debug';
import { MatCapShader } from './shaders';

export default class ForegroundScene {
  private plant: NodeResult;
  private settings: PlantariumSettings;
  private dbg: DebugScene;

  private gl: WebGL2RenderingContext;

  private mesh: Mesh;

  constructor(private scene: Scene, private pm: ProjectManager) {
    this.gl = scene.renderer.gl;

    this.initGeometry();

    this.dbg = new DebugScene(scene, pm);

    this.setSettings(pm.getSettings());
    this.setPlant(pm.getActiveProject());

    this.pm.on('settings', this.setSettings.bind(this));
    this.pm.on('plant', this.setPlant.bind(this));
  }

  initGeometry() {
    const geometry = new Box(this.scene.gl, { width: 0, height: 0, depth: 0 });
    this.mesh = this.scene.addMesh({
      geometry,
      program: MatCapShader(this.gl),
    });
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = JSON.parse(JSON.stringify(settings));
    this.update();
  }

  setPlant(plant: NodeResult) {
    this.plant = plant ? JSON.parse(JSON.stringify(plant)) : plant;
    this.update();
  }

  update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    const result = plant(p, s);

    this.mesh.mode = s?.debug?.wireframe ? this.gl.LINES : this.gl.TRIANGLES;

    this.dbg.setPlant(result);

    this.mesh.geometry = transferToGeometry(this.gl, result.geometry);
  }
}
