import { plant, worker } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import { logger, throttle } from '@plantarium/helpers';
import { createAlert, createToast } from '@plantarium/ui';
import { Box, Mesh } from 'ogl';
import type Scene from '.';
import { settingsManager, projectManager } from '..';
import { Report } from '../../elements';
import type { ProjectManager } from '../project-manager';
import DebugScene from './debug';
import { MatCapShader } from './shaders';
import * as performance from '../../helpers/performance';

console.log(!!settingsManager, 'settings');

const updateThumbnail = throttle((geo: TransferGeometry) => {
	projectManager.renderThumbnail({ geo });
}, 5000);

const log = logger('scene.foreground');
export default class ForegroundScene {
	private plant: NodeResult;
	private settings: PlantariumSettings;
	private dbg: DebugScene;

	private gl: WebGL2RenderingContext;

	private mesh: Mesh;

	private worker = worker();

	constructor(private scene: Scene, private pm: ProjectManager) {
		this.gl = scene.renderer.gl;

		this.initGeometry();

		this.dbg = new DebugScene(scene, pm);

		this.setSettings(settingsManager.getSettings());
		this.setPlant(pm.getActiveProject());

		this.pm.on('settings', this.setSettings.bind(this));
		this.pm.on('plant', this.setPlant.bind(this));
	}

	initGeometry() {
		const geometry = new Box(this.scene.gl, { width: 0, height: 0, depth: 0 });
		this.mesh = this.scene.addMesh({
			geometry,
			program: MatCapShader(this.gl)
		});
	}

	setSettings(settings: PlantariumSettings) {
		this.settings = JSON.parse(JSON.stringify(settings));
		this.update();
	}

	setPlant(plant: NodeResult) {
		if (!plant) return;
		this.plant = JSON.parse(JSON.stringify(plant));
		this.update();
	}

	async update(p = this.plant, s = this.settings) {
		if (!p || !s) return;

		this.scene.isLoading.set(true);

		try {
			performance.start('generate');

			const result =
				// eslint-disable-next-line
				//@ts-ignore
				import.meta.env.MODE === 'development' ? plant(p, s) : await this.worker.plant(p, s);

			performance.stop('generate');

			if (!result) return;

			updateThumbnail(result.geometry);

			this.scene.isLoading.set(false);

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
