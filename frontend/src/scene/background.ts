import {
  Mesh,
  Plane,
  Program,
  Color,
  Geometry,
  OGLRenderingContext,
} from 'ogl-typescript';
import Scene from 'scene';
import ProjectManager from 'project-manager';
import { ground } from '@plantarium/generator';
import { loader } from '@plantarium/helpers';
import { GroundShader } from './shaders';

const createGround = (settings: PlantariumSettings) => {
  const {
    ground: { scale: _scale = 1, resX: _resX = 16, resY: _resY = 16 } = {},
  } = settings || {};

  const scale = _scale ?? 0;
  const resX = _resX ?? 8;
  const resY = _resY ?? 8;

  const geo = ground(scale, resX, resY);

  return {
    position: { size: 3, data: new Float32Array(geo.position) },
    normal: { size: 3, data: new Float32Array(geo.normal) },
    uv: { size: 2, data: new Float32Array(geo.uv) },
    index: { size: 1, data: new Uint16Array(geo.index) },
  };
};

export default class BackgroundScene {
  private scene: Scene;
  private gl: OGLRenderingContext;
  private settings: PlantariumSettings;

  private ground: Mesh;

  constructor(scene: Scene, pm: ProjectManager) {
    this.scene = scene;
    this.gl = scene.renderer.gl;

    this.initMeshes();

    pm.on('settings', this.setSettings.bind(this));
    this.setSettings(pm.getSettings());
  }

  async initMeshes() {
    const groundGeometry = new Plane(this.gl);
    const groundTexture = loader.texture(
      this.gl,
      'assets/rocky_dirt1-albedo.jpg',
      {
        wrapS: this.gl.REPEAT,
        wrapT: this.gl.REPEAT,
      },
    );
    const groundShader = new Program(this.gl, {
      vertex: GroundShader.vertex,
      fragment: GroundShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: groundTexture },
        // Pass relevant uniforms for fog
        uFogColor: { value: new Color('#303030') },
        uFogNear: { value: 10 },
        uFogFar: { value: 30 },
        texScale: { value: 1 },
      },
    });
    this.ground = this.scene.addMesh(groundGeometry, groundShader);

    const update = (time = 0) => {
      requestAnimationFrame(update);
      groundShader.uniforms.uTime.value = time;
    };

    update();
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = settings;
    this.ground.geometry = new Geometry(this.gl, createGround(settings));
  }
}
