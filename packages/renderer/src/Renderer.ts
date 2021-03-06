import { Renderer as oRenderer, Camera, Orbit, Vec3, Transform } from 'ogl';

import { convertHexToRGB, EventEmitter } from '@plantarium/helpers';

interface RendererOptions {
  clearColor: string;
  camPos: [number, number, number];
}

export default class Renderer extends EventEmitter {
  canvas: HTMLCanvasElement;

  gl: WebGL2RenderingContext;

  renderer: oRenderer;
  scene: Transform = new Transform();
  camera: Camera;
  controls: Orbit;

  private lastCamPos: Vec3 = new Vec3(0, 0, 0);

  constructor(
    canvas: HTMLCanvasElement,
    {
      clearColor = 'ffffff',
      camPos = [0, 2, 4],
    }: Partial<RendererOptions> = {},
  ) {
    super();

    this.canvas = canvas;

    const { width, height } = canvas.getBoundingClientRect();

    this.renderer = new oRenderer({
      canvas,
      width,
      height,
      antialias: true,
      dpr: 1,
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(...convertHexToRGB(clearColor), 1);

    // Setup Camera
    this.camera = new Camera(this.gl, { fov: 70, aspect: width / height });
    this.lastCamPos.set(camPos);
    this.camera.position.set(camPos);
    this.camera.lookAt(new Vec3(0, 0, 0));

    // Setup controls
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

    this.bindEventlisteners();
    this.render();
  }

  render(): void {
    requestAnimationFrame(this.render.bind(this));

    if (!this.lastCamPos.equals(this.camera.position)) {
      this.lastCamPos.set(this.camera.position);
      this.emit('camPos', this.camera.position.toArray());
    }

    this.controls.update();

    this.renderer.render({ scene: this.scene, camera: this.camera });
  }

  bindEventlisteners() {
    // const resize = throttle(this.handleResize.bind(this), 500);
    // const resizeObserver = new ResizeObserver(resize);
    // resizeObserver.observe(this.canvas.parentElement);
  }

  handleResize() {
    const wrapper = this.canvas.parentElement;
    const { width, height } = wrapper.getBoundingClientRect();
    this.renderer.setSize(width, height);
    this.canvas.style.height = '';
    this.canvas.style.width = '';
    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });
  }
}
