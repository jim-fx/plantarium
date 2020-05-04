import { PlantariumSettings, PlantDescription } from '@plantarium/types';
import { Mesh, Box, Program, Color } from 'ogl';
import { Scene, ProjectManager } from 'components';
import { cube } from '@plantarium/generator';

export default class ForegroundScene {
  private scene: Scene;
  private pm: ProjectManager;

  private plant: PlantDescription;
  private settings: PlantariumSettings;

  private gl: WebGL2RenderingContext;

  private box: Mesh;
  private program: Program;

  constructor(scene: Scene, pm: ProjectManager) {
    this.scene = scene;
    this.gl = scene.renderer.gl;
    this.pm = pm;

    this.initGeometry();

    this.setSettings(pm.getSettings());
    this.setPlant(pm.getPlant());

    this.pm.on('settings', this.setSettings.bind(this));
    this.pm.on('plant', this.setPlant.bind(this));
  }

  initGeometry() {
    const geometry = new Box(this.scene.gl);
    this.program = new Program(this.scene.gl, {
      vertex: `
            attribute vec3 position;

            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;

            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `,
      fragment: `

            precision highp float;

            uniform vec3 uColor;

            void main() {
                gl_FragColor.rgb = uColor;
                gl_FragColor.a = 1.0;
            }
        `,
      uniforms: {
        uColor: {
          value: new Color(1, 0, 0),
        },
      },
    });
    this.box = this.scene.addMesh(geometry, this.program);
  }

  setSettings(settings: PlantariumSettings) {
    this.settings = settings;
    this.update();
  }

  setPlant(plant: PlantDescription) {
    this.plant = plant;
    this.update();
  }

  update(plant = this.plant, settings = this.settings) {
    if (!plant || !settings) return;

    const p = (plant as unknown) as any;
    this.program.uniforms.uColor.value = new Color(p.color);
    this.box.geometry = cube(this.gl, p.dims);
  }
}
