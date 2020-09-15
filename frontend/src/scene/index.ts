import ProjectManager from 'project-manager';
import Renderer from 'packages/renderer';
import {
  Transform,
  Program,
  Mesh,
  OGLRenderingContext,
  MeshOptions,
} from 'ogl-typescript';

import BackgroundScene from './background';
import ForegroundScene from './foreground';

export default class Scene {
  renderer: Renderer;
  bg: BackgroundScene;
  fg: ForegroundScene;
  scene: Transform;
  wrapper: HTMLElement;

  program: Program;
  mesh: Mesh;
  gl: OGLRenderingContext;

  constructor(pm: ProjectManager) {
    const canvas = document.getElementById(
      'render-canvas',
    ) as HTMLCanvasElement;

    this.renderer = new Renderer(canvas);
    this.renderer.handleResize();
    this.scene = this.renderer.scene;
    this.gl = this.renderer.gl;

    this.wrapper = document.getElementById('canvas-wrapper');

    this.bg = new BackgroundScene(this, pm);
    this.fg = new ForegroundScene(this, pm);
  }

  addMesh(options: Partial<MeshOptions>) {
    const mesh = new Mesh(this.gl, options);
    mesh.setParent(this.scene);
    return mesh;
  }
}
