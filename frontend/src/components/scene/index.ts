import { ProjectManager } from 'components';
import { PlantariumSettings, PlantDescription } from '@plantarium/types';
import Renderer from '@plantarium/renderer';
import { Transform, Box, Program, Mesh, Color } from 'ogl';

import * as generator from '@plantarium/generator';
import BackgroundScene from './background';
import ForegroundScene from './foreground';

export default class Scene {
  renderer: Renderer;
  bg: BackgroundScene;
  fg: ForegroundScene;
  scene: Transform;

  program: Program;
  mesh: Mesh;
  gl: WebGL2RenderingContext;

  constructor(pm: ProjectManager) {
    const canvas = document.getElementById(
      'render-canvas',
    ) as HTMLCanvasElement;

    this.renderer = new Renderer(canvas);
    this.renderer.handleResize();
    this.scene = this.renderer.scene;
    this.gl = this.renderer.gl;

    this.bg = new BackgroundScene(this, pm);
    this.fg = new ForegroundScene(this, pm);
  }

  addMesh(geometry, program) {
    const mesh = new Mesh(this.gl, { geometry, program });
    mesh.setParent(this.scene);
    return mesh;
  }
}
