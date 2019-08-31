import { Renderer, Camera, Orbit, Vec3, Transform, Texture, Program, Color, Geometry, Mesh } from "ogl";
import { FogShader, BasicShader } from "./shaders";
import { grid } from "../../model-generator/geometry";
import customControls from "./controls";

import ResizeObserver from "resize-observer-polyfill";
import debounce from "../../../helpers/debounce";

import overlay from "../overlay";

const canvas = <HTMLCanvasElement>document.getElementById("render-canvas");

let renderer: Renderer;
let scene: Transform;
let camera: Camera;
let controls: any;
let mesh: Mesh;
let ground: Mesh;
let gl: WebGL2RenderingContext;

let start = 0;

let basicShader: Program;
let showIndices: boolean;
let showSkeleton: boolean;

let gridSize: number = 5;
let gridResolution: number = 8;
let gridMesh: Mesh;

let _deferedSettings: settings;
function applySettings(_s: settings) {
  if (mesh) {
    if (_s["debug_wireframe"]) {
      mesh.mode = gl.LINE_STRIP;
    } else {
      mesh.mode = gl.TRIANGLES;
    }
  } else {
    _deferedSettings = _s;
  }

  if (_s["debug_indices"]) {
    showIndices = true;
  } else {
    showIndices = false;
  }

  if (_s["debug_skeleton"]) {
    showSkeleton = true;
  } else {
    showSkeleton = false;
  }

  if (ground) {
    if (_s["debug_disable_ground"]) {
      ground.scale.set(0, 0, 0);
    } else {
      ground.scale.set(1, 1, 1);
    }
  }

  if (gridMesh) {
    if (_s["debug_grid"]) {
      gridMesh.scale.set(1, 1, 1);

      let gridNeedsUpdate = false;

      if (_s["debug_grid_resolution"] !== gridResolution) {
        gridResolution = _s["debug_grid_resolution"];
        gridNeedsUpdate = true;
      }

      if (_s["debug_grid_size"] !== gridSize) {
        gridSize = _s["debug_grid_size"];
        gridNeedsUpdate = true;
      }

      if (gridNeedsUpdate) {
        const gridGeometry = grid(gridSize, gridResolution);
        gridMesh.geometry = new Geometry(gl, {
          position: { size: 3, data: new Float32Array(gridGeometry.position) },
          normal: { size: 3, data: new Float32Array(gridGeometry.normal) },
          uv: { size: 2, data: new Float32Array(gridGeometry.uv) }
        });
      }

      gridMesh;
    } else {
      gridMesh.scale.set(0, 0, 0);
    }
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

  controls;

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

    //Create the grid;
    const gridGeometry = grid(gridSize, gridResolution);
    gridMesh = new Mesh(gl, {
      mode: gl.LINES,
      geometry: new Geometry(gl, {
        position: { size: 3, data: new Float32Array(gridGeometry.position) },
        normal: { size: 3, data: new Float32Array(gridGeometry.normal) },
        uv: { size: 2, data: new Float32Array(gridGeometry.uv) }
      }),
      program: basicShader
    });
    gridMesh.setParent(scene);

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
    ground = new Mesh(gl, {
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
    ground.setParent(scene);

    _deferedSettings && applySettings(_deferedSettings);
    //Instantiate custom controls (up/down movement)
    customControls(canvas, controls.target, mesh.geometry);
  })();

  requestAnimationFrame(render);
})();

//Render loop
function render() {
  overlay.ms(performance.now() - start);

  requestAnimationFrame(render);

  overlay.debug3d.draw();
  controls.update();
  renderer.render({ scene, camera });

  start = performance.now();
}

export default {
  render: (model: any) => {
    if (model && "position" in model && mesh) {
      if (showIndices) {
        overlay.debug3d.points = model.position;
      }

      if (showSkeleton && "skeleton" in model) {
        overlay.debug3d.skeleton = model.skeleton;
      }

      mesh.geometry = new Geometry(gl, {
        position: { size: 3, data: model.position },
        normal: { size: 3, data: model.normal },
        uv: { size: 2, data: model.uv },
        index: { size: 1, data: model.index }
      });
    }
  },
  update: applySettings
};
