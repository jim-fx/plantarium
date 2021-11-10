import Renderer from '@plantarium/renderer';
import type { MeshOptions } from 'ogl';
import { Mesh, Program, Transform } from 'ogl';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { localState } from '../../helpers';
import type { ProjectManager } from '../project-manager';
import BackgroundScene from './background';
import ForegroundScene from './foreground';

export default class Scene {
  renderer: Renderer;
  bg: BackgroundScene;
  fg: ForegroundScene;
  scene: Transform;
  wrapper: HTMLElement;

  isLoading: Writable<boolean> = writable(false);

  program: Program;
  mesh: Mesh;
  gl: WebGL2RenderingContext;

  constructor(pm: ProjectManager, canvas: HTMLCanvasElement) {
    this.renderer = new Renderer({
      canvas,
      camPos: localState.get('camPos') as [number, number, number],
    });
    this.renderer.on('camPos', (camPos) => localState.set('camPos', camPos));
    this.renderer.handleResize();
    this.scene = this.renderer.scene;
    this.gl = this.renderer.gl;

    this.wrapper = canvas.parentElement as HTMLElement;

    this.bg = new BackgroundScene(this, pm);
    this.fg = new ForegroundScene(this, pm);
  }

  addMesh(options: Partial<MeshOptions>) {
    const mesh = new Mesh(this.gl, options);
    mesh.setParent(this.scene);
    return mesh;
  }
}
