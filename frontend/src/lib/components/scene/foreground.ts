import { transferToGeometry } from '@plantarium/geometry';
import { cloneObject, EventEmitter, logger, throttle } from '@plantarium/helpers';
import { createAlert, createToast } from '@plantarium/ui';
import { Box, Mesh, type OGLRenderingContext } from 'ogl-typescript';
import type Scene from '.';
import { settingsManager, projectManager } from '..';
import { Report } from '../../elements';
import type { ProjectManager } from '../project-manager';
import DebugScene from './debug';
import { BasicShader, DebugShader, MatCapShader, NormalShader } from './shaders';
import * as performance from '../../helpers/performance';
import { createWorker } from '@plantarium/generator';
import type { PlantProject, TransferGeometry } from '@plantarium/types';
import type { PlantariumSettings } from "$lib/types"
import { nodeSystem } from ".."

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
  private boundingBox: Mesh;

  private worker = createWorker();

  constructor(private scene: Scene, private pm: ProjectManager) {
    super()
    this.gl = scene.renderer.gl;

    const geometry = new Box(this.gl, { width: 0, height: 0, depth: 0 });

    this.mesh = this.scene.addMesh({
      geometry,
      program: getShader(this.settings?.debug.material)(this.gl),
    });

    this.boundingBox = this.scene.addMesh({
      geometry: new Box(this.gl),
      program: BasicShader(this.gl)
    })

    this.boundingBox.mode = this.gl.LINE_LOOP;


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

    if (this.boundingBox) {
      this.boundingBox.visible = settings?.debug?.boundingBox;
    }

    this.settings = cloneObject(settings);

    this.update();
  }

  setPlant(plant?: PlantProject) {
    if (!plant) return;
    this.plant = cloneObject(plant);
    this.update();
  }

  async update(p = this.plant, s = this.settings) {
    if (!p || !s) return;

    let loadingTimeout = setTimeout(() =>
      this.scene.isLoading.set(true), 400
    )

    try {
      performance.start('generate');

      const result = await this.worker.executeNodeSystem(p, s);

      performance.stop('generate');

      if (!result || result.errors || !result.geometry) {
        this.mesh.visible = false;
        if (result.errors) {
          nodeSystem.view.clearNodeLabel()
          setTimeout(() => {
            nodeSystem.view.showErrorMessages(result.errors);
          }, 100)
        }
        return;
      } else {
        nodeSystem.view.showErrorMessages([]);

        if (result.timings && s?.debug?.nodeTimings) {
          Object.entries(result.timings).forEach(([id, v]) => {
            if (v) {
              nodeSystem.view.showNodeLabel(id, `<b>${v}</b> ms`);
            }
          })

          nodeSystem?.outputNode?.view?.showErrors(`Total Time: <b>${result.timings.global}</b>ms`)
        } else {
          nodeSystem.view.clearNodeLabel();
        }

        this.mesh.visible = !this?.settings?.debug?.hideMesh;
      }

      updateThumbnail(result.geometry);

      this.dbg.setPlant(result);

      this.mesh.geometry = transferToGeometry(this.gl, result.geometry);

      this.mesh.geometry.computeBoundingBox();

      this.boundingBox.geometry = new Box(this.gl, {
        width: this.mesh.geometry.bounds.max.x - this.mesh.geometry.bounds.min.x,
        height: this.mesh.geometry.bounds.max.y - this.mesh.geometry.bounds.min.y,
        depth: this.mesh.geometry.bounds.max.z - this.mesh.geometry.bounds.min.z,
      })
      this.boundingBox.position.y = this.mesh.geometry.bounds.center.y

      this.scene.renderer.setControlTarget(this.mesh.geometry.bounds.center);

      clearTimeout(loadingTimeout)
      this.scene.isLoading.set(false);
    } catch (error) {
      log.error(error as Error);
      const res = await createToast(error as Error, {
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

