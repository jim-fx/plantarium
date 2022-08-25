import type { PlantariumSettings } from '$lib/types';
import { grid, ground, transferToGeometry } from '@plantarium/geometry';
import { loader } from '@plantarium/helpers';
import { ThemeStore } from '@plantarium/theme';
import { Color, Mesh, Plane, Program, type OGLRenderingContext } from 'ogl-typescript';
import type Scene from '.';
import { settingsManager } from '..';
import type { ProjectManager } from '../project-manager';
import {
  GridShader,
  GroundShader
} from './shaders';

const createGround = (gl: OGLRenderingContext, settings: PlantariumSettings) => {
  const { background: { scale: _scale = 1, resX: _resX = 16, resY: _resY = 16 } = {} } =
    settings || {};

  const scale = _scale ?? 0;
  const resX = _resX ?? 8;
  const resY = _resY ?? 8;

  const geo = ground(scale, resX, resY);

  return transferToGeometry(gl, geo);
};

const createGrid = (gl: OGLRenderingContext, settings: PlantariumSettings) => {
  const { scale = 1, resX = 5 } = settings?.background || {};

  const geo = grid(scale, resX);

  return transferToGeometry(gl, geo);
};

export default class BackgroundScene {
  private scene: Scene;
  private gl: OGLRenderingContext;

  private ground!: Mesh;
  private grid!: Mesh;

  constructor(scene: Scene, pm: ProjectManager) {
    this.scene = scene;
    this.gl = scene.renderer.gl;

    this.initMeshes();

    settingsManager.on('settings', (s) => this.setSettings(s));
    this.setSettings(settingsManager.getSettings());
  }

  initMeshes(): void {
    const groundGeometry = new Plane(this.gl);
    const groundTexture = loader.texture(this.gl, 'assets/rocky_dirt1-albedo.jpg', {
      wrapS: this.gl.REPEAT,
      wrapT: this.gl.REPEAT
    });
    const groundShader = new Program(this.gl, {
      vertex: GroundShader.vertex,
      fragment: GroundShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: groundTexture },
        // Pass relevant uniforms for fog
        uFogColor: { value: new Color('#ffffff') },
        uFogNear: { value: 10 },
        uFogFar: { value: 30 },
        texScale: { value: 1 }
      }
    });
    ThemeStore.subscribe((t) => {
      groundShader.uniforms.uFogColor.value = new Color(t['background-color']);
    });
    this.ground = this.scene.addMesh({
      geometry: groundGeometry,
      program: groundShader
    });

    this.grid = this.scene.addMesh({
      geometry: new Plane(this.gl),
      program: GridShader(this.gl)
    });

    this.grid.mode = this.gl.LINES;

    const update = (time = 0) => {
      requestAnimationFrame(update);
      groundShader.uniforms.uTime.value = time;
    };

    update();
  }

  setSettings(settings: PlantariumSettings) {
    if (settings?.background?.ground) {
      this.ground.geometry = createGround(this.gl, settings);
    }
    this.ground.visible = !!settings?.background?.ground;

    if (settings?.background?.grid) {
      this.grid.geometry = createGrid(this.gl, settings);
    }
    this.grid.visible = !!settings?.background?.grid;
  }
}
