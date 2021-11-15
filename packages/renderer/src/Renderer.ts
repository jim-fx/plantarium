import { convertHexToRGB, EventEmitter, throttle } from '@plantarium/helpers';
import { Camera, Orbit, Renderer as oRenderer, Transform, Vec3 } from 'ogl';

interface RendererOptions {
  clearColor: string;
  width: number;
  height: number;
  canvas: HTMLCanvasElement;
  still: boolean;
  alpha: boolean;
  camPos: [number, number, number];
}

let a = 0;

export default class Renderer extends EventEmitter {
  canvas: HTMLCanvasElement;

  gl: WebGL2RenderingContext;

  renderer: oRenderer;
  scene: Transform = new Transform();
  camera: Camera;
  controls: Orbit;
  controlTarget: Vec3;

  private lastCamPos: Vec3 = new Vec3(0, 0, 0);

  constructor({
    canvas,
    width,
    height,
    clearColor = 'ffffff',
    alpha = false,
    camPos = [0, 2, 4],
  }: Partial<RendererOptions> = {}) {
    super();

    this.canvas = canvas;

    if ((!width || !height) && canvas) {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }

    this.renderer = new oRenderer({
      canvas,
      width,
      premultipliedAlpha: true,
      height,
      alpha,
      antialias: true,
      dpr: 1,
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(...convertHexToRGB(clearColor), 0);

    if (this.renderer.gl.canvas) {
      this.canvas = this.renderer.gl.canvas;
    }

    // Setup Camera
    this.camera = new Camera(this.gl, { fov: 70, aspect: width / height });
    this.lastCamPos.set(camPos);
    this.camera.position.set(camPos);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // Setup controls
    if (canvas) {
      this.controls = new Orbit(this.camera, {
        element: canvas,
        target: new Vec3(0, 0.2, 0),
        maxPolarAngle: 1.6,
        minDistance: 0.2,
        maxDistance: 15,
        ease: 0.7,
        rotateSpeed: 0.5,
        inertia: 0.5,
      });
    }

    this.bindEventlisteners();
    if (canvas) {
      this.render();
    }
  }

  setControlTarget(vec: Vec3) {
    if (Number.isNaN(vec.x)) return;
    if (!this.controlTarget) {
      this.controls.target = vec;
    }
    this.controlTarget = vec;
  }

  setClearColor(clearColor: string) {
    this.gl.clearColor(...convertHexToRGB(clearColor), 1);
  }

  renderScene(scene: Transform) {
    this.renderer.render({ scene, camera: this.camera });
  }

  render(): void {
    requestAnimationFrame(this.render.bind(this));


    if (!this.lastCamPos.equals(this.camera.position)) {
      this.lastCamPos.set(this.camera.position);
      this.emit('camPos', this.camera.position.toArray());
    }

    if (this.controlTarget) {
      if (this.controlTarget.squaredDistance(this.controls.target) < 0.00005) {
        this.controls.target = this.controlTarget;
      } else {
        this.controls.target.lerp(this.controlTarget, 0.05);
      }
    }

    window['target'] = this.controls.target;

    this.controls.update();

    this.renderer.render({ scene: this.scene, camera: this.camera });

    this.emit("perf", performance.now()-a)
    a = performance.now();
  }

  bindEventlisteners() {
    const _throttle = throttle(() => this.handleResize(), 500);
    window.addEventListener('resize', () => {
      this.canvas.classList.add('resizing');
      _throttle();
    });
  }

  handleResize() {
    let wrapper = this.canvas.parentElement;
    if (!wrapper) wrapper = this.canvas;
    const { width, height } = wrapper.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });
    this.canvas.classList.remove('resizing');
  }
}
