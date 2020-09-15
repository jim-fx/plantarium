import ResizeObserver from 'resize-observer-polyfill';

import {
  Renderer as oRenderer,
  Camera,
  Orbit,
  Vec3,
  Transform,
  OGLRenderingContext,
} from 'ogl-typescript';

import { throttle } from 'packages/helpers';

export default class Renderer {
  canvas: HTMLCanvasElement;

  gl: OGLRenderingContext;

  renderer: oRenderer;
  scene: Transform = new Transform();
  camera: Camera;
  controls: typeof Orbit;

  constructor(canvas: HTMLCanvasElement) {
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
    this.gl.clearColor(0.18823, 0.18823, 0.18823, 1);

    // Setup Camera
    this.camera = new Camera(this.gl, { fov: 70, aspect: width / height });
    this.camera.position.set(0, 2, 4);
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

  render() {
    requestAnimationFrame(this.render.bind(this));
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    //@ts-ignore
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
