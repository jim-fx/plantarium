import { Mesh, Box, Program, OGLRenderingContext } from 'ogl-typescript';

import Scene from 'scene';
import ProjectManager from 'project-manager';
import { plant } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import { BasicShader } from './shaders';
import { NodeResult, PlantariumSettings } from '@plantarium/types';

export default class ForegroundScene {
  private scene: Scene;
  private pm: ProjectManager;

  private plant: NodeResult;
  private settings: PlantariumSettings;

  private gl: OGLRenderingContext;

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

  setPlant(plant: NodeResult) {
    this.plant = plant ? JSON.parse(JSON.stringify(plant)) : plant;
    this.update();
  }

  update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    console.log('PLANT', JSON.parse(JSON.stringify(p)));

    if (!p['main']) return;

    const result = plant(p, s);

    this.mesh.geometry = transferToGeometry(this.gl, result.geometry);
  }
}
