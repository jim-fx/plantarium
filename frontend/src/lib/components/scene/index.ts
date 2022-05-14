import Renderer from '@plantarium/renderer';
import type { MeshOptions } from 'ogl';
import { Mesh, Program, Transform } from 'ogl';
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
import { localState } from '../../helpers';
import type { ProjectManager } from '../project-manager';
import BackgroundScene from './background';
import ForegroundScene from './foreground';
import * as performance from '../../helpers/performance';
import { ThemeStore } from '@plantarium/theme';

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
      camPos: localState.get('camPos') as [number, number, number]
    });
    this.renderer.on('camPos', (camPos) => localState.set('camPos', camPos));
    this.renderer.on('perf', (perf: number) => performance.add('render', perf), 40);
    this.renderer.handleResize();
    this.scene = this.renderer.scene;
    this.gl = this.renderer.gl;

    ThemeStore.subscribe((t) => {
      this.renderer.setClearColor(t['background-color']);
    });

    this.wrapper = canvas.parentElement as HTMLElement;

    this.bg = new BackgroundScene(this, pm);
    this.fg = new ForegroundScene(this, pm);
  }

  addMesh(options: Partial<MeshOptions>): Mesh {
    const mesh = new Mesh(this.gl, options);
    mesh.setParent(this.scene);
    return mesh;
  }
}
