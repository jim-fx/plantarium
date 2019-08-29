import { Renderer, Camera, Orbit, Vec3, Transform, Texture, Program, Color, Geometry, Mesh } from "ogl";
import customControls from "./controls";
import { FogShader, BasicShader } from "./shaders";

import ResizeObserver from "resize-observer-polyfill";
import debounce from "../../../helpers/debounce";

import overlay from "../overlay";
import settings from "../../settings";

const canvas = <HTMLCanvasElement>document.getElementById("render-canvas");

let renderer: Renderer;
let scene: Transform;
let camera: Camera;
let controls: any;
let mesh: Mesh;
let gl: WebGL2RenderingContext;

let basicShader, showIndices: boolean;

//Handle resizing
(() => {
  const resize = debounce(
    () => {
      const wrapper = <HTMLElement>canvas.parentElement;
      const b = wrapper.getBoundingClientRect();
      renderer.setSize(b.width, b.height);
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height });
    },
    200,
    false
  );
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(<HTMLElement>canvas.parentElement);
})();

let start = 0;
function update() {
  overlay.ms(performance.now() - start);

  requestAnimationFrame(update);

  overlay.debug3d.line();
  controls.update();
  renderer.render({ scene, camera });

  start = performance.now();
}

function applySettings() {
  const _s = settings.object;

  if (mesh) {
    if (_s["debug_wireframe"]) {
      mesh.mode = gl.LINE_STRIP;
    } else {
      mesh.mode = gl.TRIANGLES;
    }
  }

  if (_s["debug_indices"]) {
    showIndices = true;
  } else {
    showIndices = false;
  }
}

//Init
(async () => {
  const b = canvas.getBoundingClientRect();
  renderer = new Renderer({
    width: b.width,
    antialias: true,
    height: b.height,
    canvas: canvas
  });
  gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  camera = new Camera(gl, { fov: 70, aspect: b.width / b.height });
  camera.position.set(0, 2, 4);
  camera.lookAt(new Vec3(0, 0, 0));

  overlay.debug3d.camera = camera;

  controls = new Orbit(camera, {
    target: new Vec3(0, 0.2, 0),
    maxPolarAngle: 1.6,
    minDistance: 1,
    maxDistance: 15,
    enablePan: false,
    rotateSpeed: 0.5,
    inertia: 0.5,
    element: canvas
  });

  scene = new Transform();

  //Load the models;
  (async () => {
    //Load uv checker Texture
    const uvTexture = new Texture(gl, {
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT
    });
    const uvImg = new Image();
    uvImg.onload = () => (uvTexture.image = uvImg);
    uvImg.src = "assets/uv.png";

    //Load placeholder plant geometry
    const plantGeometry = await (await fetch(`assets/plant.json`)).json();

    basicShader = new Program(gl, {
      vertex: BasicShader.vertex,
      fragment: BasicShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: uvTexture },
        // Pass relevant uniforms for fog
        uFogColor: { value: new Color("#ffffff") },
        uFogNear: { value: 10 },
        uFogFar: { value: 30 }
      }
    });

    /*wireFrameShader = new Program(gl, {
      vertex: WireFrameShader.vertex,
      fragment: WireFrameShader.fragment,
      uniforms: {
        time: { value: 0 },
        fill: { value: new Color(0, 1, 0) },
        stroke: { value: new Color(1, 0, 0) },
        noiseA: { value: false },
        noiseB: { value: false },
        dualStroke: { value: false },
        seeThrough: { value: false },
        insideAltColor: { value: true },
        thickness: { value: 0.01 },
        secondThickness: { value: 0.05 },
        dashEnabled: { value: true },
        dashRepeats: { value: 2.0 },
        dashOverlap: { value: false },
        dashLength: { value: 0.55 },
        dashAnimate: { value: false },
        squeeze: { value: false },
        squeezeMin: { value: 0.1 },
        squeezeMax: { value: 1.0 }
      }
    });*/

    //Create the main mesh with the placeholder geometry
    mesh = new Mesh(gl, {
      geometry: new Geometry(gl, {
        position: { size: 3, data: new Float32Array(plantGeometry.position) },
        normal: { size: 3, data: new Float32Array(plantGeometry.normal) },
        uv: { size: 2, data: new Float32Array(plantGeometry.uv) }
      }),
      program: basicShader
    });
    mesh.setParent(scene);
    mesh.geometry.computeBoundingBox();

    //Load the ground/dirt texture (from freepbr.com)
    const groundTexture = new Texture(gl, {
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT
    });
    const img = new Image();
    img.onload = () => (groundTexture.image = img);
    img.src = "assets/rocky_dirt1-albedo.png";

    //Load ground object
    const groundGeometry = await (await fetch(`assets/ground2.json`)).json();
    const groundMesh = new Mesh(gl, {
      program: new Program(gl, {
        vertex: FogShader.vertex,
        fragment: FogShader.fragment,
        uniforms: {
          uTime: { value: 0 },
          tMap: { value: groundTexture },
          // Pass relevant uniforms for fog
          uFogColor: { value: new Color("#ffffff") },
          uFogNear: { value: 10 },
          uFogFar: { value: 30 }
        }
      }),
      geometry: new Geometry(gl, {
        position: { size: 3, data: new Float32Array(groundGeometry.position) },
        uv: { size: 2, data: new Float32Array(groundGeometry.uv) }
      })
    });
    groundMesh.setParent(scene);

    //Instantiate custom controls (up/down movement)
    customControls(canvas, controls.target, mesh.geometry);

    applySettings();
  })();

  requestAnimationFrame(update);
})();

export default {
  render: (model: any) => {
    if (model && "position" in model && mesh) {
      if (showIndices) {
        overlay.debug3d.points = model.position;
      }

      mesh.geometry = new Geometry(gl, {
        position: { size: 3, data: model.position },
        normal: { size: 3, data: model.normal },
        uv: { size: 2, data: model.uv },
        index: { size: 1, data: model.index }
      });
    }
  },
  update: () => {
    applySettings();
  }
};
