import {
  Mesh,
  Program,
  OGLRenderingContext,
  Geometry,
  Sphere,
} from 'ogl-typescript';

import type Scene from '.';
import type { ProjectManager } from '../project-manager';
import { InstanceShader, WireFrameShader } from './shaders';

let sphere: Sphere;

export default class DebugScene {
  private plant: GeometryResult;
  private settings: PlantariumSettings;

  private gl: OGLRenderingContext;

  private m: { [key: string]: Mesh } = {};

  constructor(private scene: Scene, private pm: ProjectManager) {
    this.gl = scene.renderer.gl;

    this.initHTML();
    this.initGeometry();

    this.setSettings(pm.getSettings());

    sphere = new Sphere(this.scene.gl, {
      radius: 0.001,
      widthSegments: 8,
      heightSegments: 8,
    });

    pm.on('settings', this.setSettings.bind(this));
  }

  initHTML() {
    // // debug pd
    // const pd = document.getElementById('debug-pd');
    // let { debugPd = false } = this.pm.getSettings();
    // pd.style.display = debugPd ? 'block' : 'none';
    // pd.innerHTML = JSON.stringify(this.pm.getPlant(), null, 2);
    // this.pm.on('settings', ({ debugPd: _dbg = false }) => {
    //   pd.style.display = _dbg ? 'block' : 'none';
    //   debugPd = _dbg;
    // });
    // this.pm.on('plant', (p) => {
    //   if (debugPd) pd.innerHTML = JSON.stringify(p, null, 2);
    // });
  }

  initGeometry() {
    this.m.skeleton = this.scene.addMesh({
      geometry: new Geometry(this.gl, {
        position: { size: 3, data: new Float32Array([0, 0, 0]) },
        uv: { size: 2, data: new Float32Array([0, 0]) },
        index: { size: 1, data: new Uint16Array([0]) },
      }),
      program: new Program(this.gl, {
        vertex: WireFrameShader.vertex,
        fragment: WireFrameShader.fragment,
        depthTest: false,
      }),
    });
    this.m.skeleton.mode = this.gl.LINES;

    this.m.vertices = this.scene.addMesh({
      geometry: new Geometry(this.gl, {
        position: { size: 3, data: new Float32Array([0, 0, 0]) },
        uv: { size: 2, data: new Float32Array([0, 0]) },
        index: { size: 1, data: new Uint16Array([0]) },
        offset: { instanced: 1, size: 3, data: [0, 0, 0] },
      }),
      program: new Program(this.gl, {
        vertex: InstanceShader.vertex,
        fragment: InstanceShader.fragment,
        depthTest: false,
      }),
    });
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = JSON.parse(JSON.stringify(settings));

    this.m.skeleton.visible = !!this.settings.debug?.skeleton;
    this.m.vertices.visible = !!this.settings.debug?.skeleton;

    this.update();
  }

  setPlant(plant: GeometryResult) {
    this.plant = plant;
    this.update();
  }

  update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    //Convert skeletons to Geometry
    if (p['skeletons'] && s.debug?.skeleton) {
      const skeletons: Float32Array[] = p['skeletons'];
      const amountPos = skeletons.reduce((acc, cur) => acc + cur.length, 0) / 4;

      console.log(skeletons);

      const positions = new Float32Array(amountPos * 3);
      const uv = new Float32Array(amountPos * 2);
      const indeces = new Uint32Array(amountPos * 2 - 4);

      // Transfer positions;
      let offset = 0;
      skeletons.forEach((skelly) => {
        const amount = skelly.length / 4;
        for (let i = 0; i < amount; i++) {
          positions[offset + i * 3 + 0] = skelly[i * 4 + 0];
          positions[offset + i * 3 + 1] = skelly[i * 4 + 1];
          positions[offset + i * 3 + 2] = skelly[i * 4 + 2];
        }
        offset += amount;
      });

      // Create uv
      const amountUV = amountPos * 2;
      for (let i = 0; i < amountUV; i++) {
        uv[i * 2 + 0] = i / amountUV;
        uv[i * 2 + 1] = 0.5;
      }

      // Create indeces
      indeces[0] = 0;
      for (let i = 1; i < amountPos * 2 - 4; i += 2) {
        indeces[i] = i;
        indeces[i + 1] = i;
      }

      this.m.skeleton.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions },
        uv: { size: 2, data: uv },
        index: { size: 1, data: indeces },
      });

      this.m.vertices.geometry.attributes.offset.instanced = 1;
      this.m.vertices.geometry.attributes.offset.data = positions;
      this.m.vertices.geometry.attributes.offset.needsUpdate = true;

      this.m.vertices.geometry = new Geometry(this.scene.gl, {
        position: sphere.attributes.position,
        index: sphere.attributes.index,
        uv: sphere.attributes.uv,
        normal: sphere.attributes.normal,

        offset: { instanced: 1, size: 3, data: positions },
      });
    }

    /* if (p['skeletons'] && s.debugSkeleton && false) {
      const num = 20;

      let offset = new Float32Array(num * 3);
      let random = new Float32Array(num * 3);
      for (let i = 0; i < num; i++) {
        offset.set(
          [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
          i * 3,
        );

        // unique random values are always handy for instances.
        // Here they will be used for rotation, scale and movement.
        random.set([Math.random(), Math.random(), Math.random()], i * 3);
      }

      const geometry = new Geometry(this.gl, {
        position: { size: 3, data: new Float32Array(data.position) },
        uv: { size: 2, data: new Float32Array(data.uv) },
        normal: { size: 3, data: new Float32Array(data.normal) },

        // simply add the 'instanced' property to flag as an instanced attribute.
        // set the value as the divisor number
        offset: { instanced: 1, size: 3, data: offset },
        random: { instanced: 1, size: 3, data: random },
      });

      this.m.skeleton.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions },
        normal: { size: 3, data: normal },
        uv: { size: 2, data: uv },
        index: { size: 1, data: indeces },
      });
    } */
  }
}
