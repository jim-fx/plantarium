import { transferToGeometry } from '@plantarium/geometry';
import { EventEmitter, logger, throttle } from '@plantarium/helpers';
import { createAlert, createToast } from '@plantarium/ui';
import { Box, Mesh, type OGLRenderingContext } from 'ogl-typescript';
import type Scene from '.';
import { settingsManager, projectManager } from '..';
import { Report } from '../../elements';
import type { ProjectManager } from '../project-manager';
import DebugScene from './debug';
import { DebugShader, MatCapShader, NormalShader } from './shaders';
import * as performance from '../../helpers/performance';
import { createWorker } from '@plantarium/generator';
import type { PlantProject, TransferGeometry } from '@plantarium/types';
import type { PlantariumSettings } from "$lib/types"

const updateThumbnail = throttle((geo: TransferGeometry) => {
  projectManager.renderThumbnail({ geo });
}, 5000);

function getShader(t?: string) {
  if (t === "MatCap") return MatCapShader;
  if (t === "Debug") return DebugShader;
  return NormalShader
}

const log = logger('scene.foreground');
export default class ForegroundScene extends EventEmitter {
  private plant: PlantProject | undefined;
  private settings: PlantariumSettings | undefined;
  private dbg: DebugScene;

  private gl: OGLRenderingContext;

  private mesh: Mesh;

  private worker = createWorker();

  constructor(private scene: Scene, private pm: ProjectManager) {
    super()
    this.gl = scene.renderer.gl;

    const geometry = new Box(this.gl, { width: 0, height: 0, depth: 0 });

    this.mesh = this.scene.addMesh({
      geometry,
      program: getShader(this.settings?.debug.material)(this.gl),
    });


    this.dbg = new DebugScene(scene, pm);

    this.setSettings(settingsManager.getSettings());
    this.setPlant(pm.getActiveProject());

    this.pm.on('settings', s => this.setSettings(s as PlantariumSettings));
    this.pm.on('plant', p => this.setPlant(p as PlantProject));
  }


  setSettings(settings: PlantariumSettings) {
    if (this.mesh && settings?.debug?.material !== this.settings?.debug?.material) {
      this.mesh.program = getShader(settings?.debug?.material)(this.gl);
    }

    if (this.mesh && settings?.debug?.wireframe) {
      this.mesh.mode = this.gl.LINE_LOOP
    } else {
      this.mesh.mode = this.gl.TRIANGLES
    }

    this.settings = JSON.parse(JSON.stringify(settings));

    this.update();
  }

  setPlant(plant?: PlantProject) {
    if (!plant) return;
    this.plant = window["structuredClone"](plant);
    this.update();
  }

  async update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    this.scene.isLoading.set(true);

    try {
      performance.start('generate');

      const result = await this.worker.executeNodeSystem(p, s);

      performance.stop('generate');

      this.scene.isLoading.set(false);

      if (!result || result.errors || !result.geometry) {
        this.mesh.visible = false;
        if (result.errors) {
          this.emit("node-errors", result.errors)
        }
        return;
      } else {
        this.emit("node-errors", []);
        this.mesh.visible = !this?.settings?.debug?.hideMesh;
      }

      updateThumbnail(result.geometry);

      this.dbg.setPlant(result);

      this.mesh.geometry = transferToGeometry(this.gl, result.geometry);

      this.mesh.geometry.computeBoundingBox();

      this.scene.renderer.setControlTarget(this.mesh.geometry.bounds.center);
    } catch (error) {
      log.error(error);
      const res = await createToast(error, {
        title: 'Error [Generator]',
        values: ['report']
      });

      if (res === 'report') {
        console.error(error);
        createAlert(Report, {
          timeout: 0,
          title: 'Report Bug',
          type: 'error',
          props: { mode: 'bug', error }
        });
      }
    }
  }
}

