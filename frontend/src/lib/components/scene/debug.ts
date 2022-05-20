import type { PlantariumSettings } from '$lib/types';
import { insertArray } from '@plantarium/geometry';
import { cloneObject } from '@plantarium/helpers';
import type { PlantStem, TransferGeometry } from '@plantarium/types';
import { Geometry, Mesh, Program, type OGLRenderingContext } from 'ogl-typescript';
import type Scene from '.';
import { settingsManager } from '..';
import type { ProjectManager } from '../project-manager';
import { ParticleShader, WireFrameShader } from './shaders';

export default class DebugScene {
  private plant?: {
    stems: PlantStem[]
    geometry: TransferGeometry
  };
  private settings: PlantariumSettings;

  private gl: OGLRenderingContext;

  private m: { [key: string]: Mesh } = {};

  constructor(private scene: Scene, pm: ProjectManager) {
    this.gl = scene.renderer.gl;

    this.initGeometry();

    this.settings = settingsManager.getSettings()
    this.setSettings(this.settings);

    pm.on('settings', s => this.setSettings(s as PlantariumSettings));
  }

  initGeometry() {
    this.m.skeleton = this.scene.addMesh({
      geometry: new Geometry(this.gl, {
        position: { size: 3, data: new Float32Array([0, 0, 0]) },
        uv: { size: 2, data: new Float32Array([0, 0]) },
        index: { size: 1, data: new Uint16Array([0]) }
      }),
      program: WireFrameShader(this.gl),
      mode: this.gl.LINES
    });
    // this.m.skeleton.mode = this.gl.LINES;

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
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = cloneObject(settings);

    this.m.skeleton.visible = !!this.settings.debug?.skeleton;
    this.m.vertices.visible = !!this.settings.debug?.skeleton;

    this.update();
  }

  setPlant(plant: typeof this.plant) {
    this.plant = plant;
    this.update();
  }

  update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    //Convert skeletons to Geometry
    if (p.stems && s.debug?.skeleton) {
      const stems = p.stems;
      let amountPos = 0;
      for (const stem of stems) {
        amountPos += (stem.skeleton.length / 4) * 3;
      }

      const positions = new Float32Array(amountPos);
      const indeces = new Uint32Array((amountPos / 3 - 1) * 2);
      const depthBuffer = new Float32Array(amountPos);

      // Transfer positions;
      let maxDepth = 0;
      let offset = 0;
      stems.forEach(({ skeleton: skelly, depth }) => {
        const amount = skelly.length / 4;

        maxDepth = Math.max(maxDepth, depth)

        insertArray(depthBuffer, offset, new Float32Array(amount).fill(depth));

        for (let i = 0; i < amount; i++) {
          positions[offset * 3 + i * 3 + 0] = skelly[i * 4 + 0];
          positions[offset * 3 + i * 3 + 1] = skelly[i * 4 + 1];
          positions[offset * 3 + i * 3 + 2] = skelly[i * 4 + 2];
        }

        for (let i = 0; i < amount - 1; i++) {
          indeces[offset * 2 + i * 2] = offset + i;
          indeces[offset * 2 + i * 2 + 1] = offset + i + 1;
        }

        offset += amount;
      });

      this.m.skeleton.program.uniforms.maxDepth.value = maxDepth;

      this.m.skeleton.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions },
        depth: { size: 1, data: depthBuffer },
        index: { size: 1, data: indeces }
      });

      this.m.vertices.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions }
      });
    }
  }
}
