import { Geometry, Mesh, Program } from 'ogl-typescript';
import type Scene from '.';
import { settingsManager } from '..';
import type { ProjectManager } from '../project-manager';
import { ParticleShader, WireFrameShader } from './shaders';

export default class DebugScene {
  private plant: GeometryResult;
  private settings: PlantariumSettings;

  private gl: WebGL2RenderingContext;

  private m: { [key: string]: Mesh } = {};

  constructor(private scene: Scene, private pm: ProjectManager) {
    this.gl = scene.renderer.gl;

    this.initGeometry();

    this.setSettings(settingsManager.getSettings());

    pm.on('settings', this.setSettings.bind(this));
  }

  initGeometry() {
    this.m.skeleton = this.scene.addMesh({
      geometry: new Geometry(this.gl, {
        position: { size: 3, data: new Float32Array([0, 0, 0]) },
        uv: { size: 2, data: new Float32Array([0, 0]) },
        index: { size: 1, data: new Uint16Array([0]) }
      }),
      program: new Program(this.gl, {
        vertex: WireFrameShader.vertex,
        fragment: WireFrameShader.fragment,
        depthTest: false
      }),
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
    if ((p.allSkeletons || p.skeletons) && s.debug?.skeleton) {
      const skeletons: Float32Array[] = p.allSkeletons ?? p.skeletons;
      let amountPos = 0;
      for (const skelly of skeletons) {
        amountPos += (skelly.length / 4) * 3;
      }

      const positions = new Float32Array(amountPos);
      const indeces = new Uint32Array((amountPos / 3 - 1) * 2);

      // Transfer positions;
      let offset = 0;
      skeletons.forEach((skelly) => {
        const amount = skelly.length / 4;

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

      this.m.skeleton.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions },
        index: { size: 1, data: indeces }
      });

      this.m.vertices.geometry = new Geometry(this.gl, {
        position: { size: 3, data: positions }
      });
    }
  }
}
