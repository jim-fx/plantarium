import { ProjectManager } from 'components';
import Renderer from '@plantarium/renderer';
import { Transform, Program, Mesh } from 'ogl';

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
  gl: WebGL2RenderingContext;

  constructor(pm: ProjectManager) {
    const canvas = document.getElementById(
      'render-canvas',
    ) as HTMLCanvasElement;

    this.renderer = new Renderer(canvas);
    this.renderer.handleResize();
    this.scene = this.renderer.scene;
    this.gl = this.renderer.gl;

    this.wrapper = document.getElementById('canvas-wrapper');

    // debug pd
    const pd = document.getElementById('debug-pd');
    const { debugPd = false } = pm.getSettings();
    pd.style.display = debugPd ? 'block' : 'none';
    pd.innerHTML = JSON.stringify(pm.getPlant(), null, 2);
    pm.on('settings', ({ debugPd = false }) => {
      pd.style.display = debugPd ? 'block' : 'none';
    });
    pm.on('plant', (p) => {
      pd.innerHTML = JSON.stringify(p, null, 2);
    });

    this.bg = new BackgroundScene(this, pm);
    this.fg = new ForegroundScene(this, pm);
  }

  addMesh(geometry, program) {
    const mesh = new Mesh(this.gl, { geometry, program });
    mesh.setParent(this.scene);
    return mesh;
  }
}
