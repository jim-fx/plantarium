import type { PlantariumSettings } from '$lib/types';
import { cloneObject, groupArray, hslToRgb } from '@plantarium/helpers';
import type { PlantStem, TransferGeometry } from '@plantarium/types';
import {
  Color,
  Geometry,
  Mesh,
  Polyline,
  Program,
  Transform,
  Vec3,
  type OGLRenderingContext
} from 'ogl';
import type Scene from '.';
import { settingsManager } from '..';
import { ParticleShader } from './shaders';

export default class DebugScene {
  private plant?: {
    stems: PlantStem[];
    geometry: TransferGeometry;
    debug?: {
      vec3: number[];
      point: number[];
    };
  };
  private settings: PlantariumSettings;

  private gl: OGLRenderingContext;

  private m: { [key: string]: Transform } = {};

  constructor(private scene: Scene) {
    this.gl = scene.renderer.gl;

    this.initGeometry();

    this.settings = settingsManager.getSettings();

    this.setSettings(this.settings);

    settingsManager.on('settings', (s) => this.setSettings(s as PlantariumSettings));
  }

  initGeometry() {
    this.m.skeleton = this.scene.addTransform(new Transform());

    this.m.vertices = this.scene.addMesh({
      mode: this.gl.POINTS,
      geometry: new Geometry(this.gl, {
        position: { size: 3, data: new Float32Array(3) }
      }),
      program: new Program(this.gl, {
        vertex: ParticleShader.vertex,
        fragment: ParticleShader.fragment,
        depthTest: false,
        transparent: true
      })
    });

    this.m.vec3 = this.scene.addTransform(new Transform());
  }

  setSettings(settings: PlantariumSettings = this.settings) {

    this.settings = cloneObject(settings);
    if (!settings) {

      console.trace({ settings, s: this.settings, cloneObject })
    }

    this.m.skeleton.visible = !!this.settings.debug?.skeleton;
    this.m.vertices.visible = !!this.settings.debug?.skeleton;

    this.update();
  }

  setPlant(plant: typeof this.plant) {
    this.plant = plant;
    this.update();
  }

  setVec3(vec3?: number[]) {
    this.m.vec3.children = [];
    if (!vec3?.length) {
      this.m.vec3.visible = false;
      return;
    } else {
      this.m.vec3.visible = true;
    }

    const amountVec = vec3.length / 7;

    for (let i = 0; i < amountVec; i++) {
      const origin = new Vec3(...vec3.slice(i * 7 + 3, i * 7 + 6));

      const endPoint = origin
        .clone()
        .add(new Vec3(...vec3.slice(i * 7, i * 7 + 3)).normalize().scale(0.2));

      const polyline = new Polyline(this.gl, {
        points: [origin, endPoint],
        uniforms: {
          uColor: { value: Color.from(hslToRgb(vec3[i * 7 + 7], 1, 0.5)) },
          uThickness: { value: 1 }
        }
      });
      polyline.program.depthTest = false;
      const mesh = new Mesh(this.gl, { geometry: polyline.geometry, program: polyline.program });
      mesh.setParent(this.m.vec3);
    }
  }

  update(p = this.plant, s = this.settings) {
    if (s?.debug?.debugVectors) {
      this.setVec3(p?.debug?.vec3);
    } else {
      this.m.vec3.visible = false;
    }

    if (!p || !s) return;

    //Convert skeletons to Geometry
    if (p.stems && s.debug?.skeleton) {
      const stems = p.stems;
      let amountPos = 0;
      for (const stem of stems) {
        amountPos += (stem.skeleton.length / 4) * 3;
      }

      let positions = new Float32Array(amountPos);

      let offset = 0;
      this.m.skeleton.children = [];
      stems.forEach(({ skeleton: skelly, depth }) => {
        const amount = skelly.length / 4;
        const polyline = new Polyline(this.gl, {
          points: groupArray(skelly, 4).map((v) => new Vec3(...v)),
          uniforms: {
            uColor: { value: new Color('#fff') },
            uThickness: { value: 1 }
          }
        });
        polyline.program.depthTest = false;
        const mesh = new Mesh(this.gl, { geometry: polyline.geometry, program: polyline.program });
        mesh.setParent(this.m.skeleton);

        for (let i = 0; i < amount; i++) {
          positions[offset * 3 + i * 3 + 0] = skelly[i * 4 + 0];
          positions[offset * 3 + i * 3 + 1] = skelly[i * 4 + 1];
          positions[offset * 3 + i * 3 + 2] = skelly[i * 4 + 2];
        }
      });

      // this.m.skeleton.program.uniforms.maxDepth.value = maxDepth;

      // this.m.skeleton.geometry = new Geometry(this.gl, {
      //   position: { size: 3, data: positions },
      //   depth: { size: 1, data: depthBuffer },
      //   index: { size: 1, data: indeces }
      // });
      //
      if (p?.debug?.point?.length) {
        // const _pos = new Float32Array(positions.length + p.debug.point.length);
        // _pos.set(positions);
        // _pos.set(p.debug.point, positions.length);
        // positions = _pos;
        positions = Float32Array.from(p.debug.point);
      }

      this.m.vertices.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions }
      });
    }
  }
}
