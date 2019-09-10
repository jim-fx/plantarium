import {
  Renderer,
  Camera,
  Orbit,
  Vec3,
  Transform,
  Color,
  Geometry,
  Mesh,
  Vec2
} from "ogl";
import { grid, ground } from "../../model-generator/geometry";
import load from "./helpers/loader";

import debounce from "../../../helpers/debounce";

import overlay from "../overlay";

const canvas = <HTMLCanvasElement>document.getElementById("render-canvas");

let renderer: Renderer;
let scene: Transform;
let camera: Camera;
let controls: any;
let plant: Geometry;
let plantMesh: Mesh;
let groundMesh: Mesh;
let gl: WebGL2RenderingContext;
let leaf: Geometry;
let leafMesh: Mesh;

let showIndices: boolean;
let showSkeleton: boolean;

let gridSize: number = 5;
let gridResolution: number = 8;
let gridMesh: Mesh;

let _deferredSettings: settings;

async function applySettings(_s: settings) {
  if (!_deferredSettings) {
    if (_s) {
      _deferredSettings = _s;
    }
  }

  if (plant) {
    if (_s["debug_wireframe"]) {
      plantMesh.mode = gl.LINES;
      groundMesh.mode = gl.LINES;
      leafMesh.mode = gl.LINES;
    } else {
      plantMesh.mode = gl.TRIANGLES;
      groundMesh.mode = gl.TRIANGLES;
      leafMesh.mode = gl.TRIANGLES;
    }
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

  if (groundMesh) {
    const resX = _s["ground_resX"] || 12;
    const resY = _s["ground_resY"] || 12;
    const size = _s["ground_size"] || 0.00001;
    if (resX && resY && size) {
      const groundGeometry = ground(size, resX, resY);
      groundMesh.geometry = new Geometry(gl, {
        position: { size: 3, data: new Float32Array(groundGeometry.position) },
        normal: { size: 3, data: new Float32Array(groundGeometry.normal) },
        uv: { size: 2, data: new Float32Array(groundGeometry.uv) },
        index: { size: 1, data: new Uint16Array(groundGeometry.index) }
      });
    }

    if (_s["ground_enable"]) {
      groundMesh.scale.set(1, 1, 1);
      if (!groundMesh.parent) {
        groundMesh.setParent(scene);
      }
      groundMesh.geometry.setDrawRange(0, 890);
    } else {
      groundMesh.scale.set(0.00001, 0, 0);
    }

    if (_s["ground_texture_size"]) {
      groundMesh.program.uniforms.texScale.value = _s["ground_texture_size"];
    }
  }

  if (plant) {
    if (_s["debug_disable_model"]) {
      plantMesh.scale.set(0, 0, 0);
    } else {
      plantMesh.scale.set(1, 1, 1);
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
          uv: { size: 2, data: new Float32Array(gridGeometry.uv) },
          index: { size: 1, data: new Uint16Array(gridGeometry.index) }
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
    dpr: window.devicePixelRatio || 1,
    canvas: canvas
  });
  gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);
  load.setGl(gl);

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

  if (localStorage.pdCamera)
    camera.position.fromArray(
      localStorage.pdCamera.split(",").map((v: string) => parseFloat(v))
    );

  overlay.debug3d.camera = camera;

  controls = new Orbit(camera, {
    target: new Vec3(0, 0.2, 0),
    maxPolarAngle: 1.6,
    minDistance: 0.2,
    maxDistance: 15,
    //enablePan: false,
    ease: 0.7,
    rotateSpeed: 0.5,
    inertia: 0.5,
    element: canvas
  });

  scene = new Transform();

  //Load the models;
  (async () => {
    //Load the ground/dirt texture (from freepbr.com)
    const groundTexture = load.texture("assets/rocky_dirt1-albedo.jpg", {
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT
    });

    const basicShader = load.shader("BasicShader", {
      uTime: { value: 0 },
      uMouse: { value: new Vec2(1, 1) },
      uResolution: { value: new Vec2(250, 250) },
      tMap: { value: groundTexture }
    });

    //Create the grid;
    const gridGeometry = grid(gridSize, gridResolution);
    gridMesh = new Mesh(gl, {
      mode: gl.LINES,
      geometry: new Geometry(gl, {
        position: { size: 3, data: new Float32Array(gridGeometry.position) },
        normal: { size: 3, data: new Float32Array(gridGeometry.normal) },
        uv: { size: 2, data: new Float32Array(gridGeometry.uv) },
        index: { size: 1, data: new Uint16Array(gridGeometry.index) }
      }),
      program: basicShader
    });
    gridMesh.setParent(scene);

    plant = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([0, 0, 0]) },
      normal: { size: 3, data: new Float32Array([0, 0, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0]) },
      index: { size: 1, data: new Uint16Array([0, 0]) }
    });

    //Create the main mesh with the placeholder geometry
    plantMesh = new Mesh(gl, {
      geometry: plant,
      program: basicShader
    });
    plantMesh.setParent(scene);
    plant.computeBoundingBox();

    leaf = new Geometry(gl, {
      position: { size: 3, data: new Float32Array([0, 0, 0, 0, 0, 0]) },
      normal: { size: 3, data: new Float32Array([0, 0, 0, 0, 0, 0]) },
      uv: { size: 2, data: new Float32Array([0, 0, 0, 0]) },
      index: { size: 1, data: new Uint16Array([0, 1]) },
      // simply add the 'instanced' property to flag as an instanced attribute.
      // set the value as the divisor number
      offset: {
        instanced: 1,
        size: 3,
        data: new Float32Array([0, 0, 0, 1, 1, 1])
      },
      rotation: {
        instanced: 1,
        size: 3,
        data: new Float32Array([0, 0, 0, 1, 1, 1])
      },
      scale: {
        instanced: 1,
        size: 3,
        data: new Float32Array([0, 0, 0, 1, 1, 1])
      }
    });
    const instanceShader = load.shader("InstanceShader", {
      uTime: { value: 0 }
    });

    leafMesh = new Mesh(gl, {
      geometry: leaf,
      program: instanceShader
    });

    leafMesh.setParent(scene);

    //Load ground object
    groundMesh = new Mesh(gl, {
      //mode: gl.LINES,
      program: load.shader("GroundShader", {
        uTime: { value: 0 },
        tMap: { value: groundTexture },
        // Pass relevant uniforms for fog
        uFogColor: { value: new Color("#ffffff") },
        uFogNear: { value: 10 },
        uFogFar: { value: 30 },
        texScale: { value: 1 }
      }),
      geometry: new Geometry(gl, {
        position: { size: 3, data: new Float32Array([0, 0, 0]) },
        normal: { size: 1, data: new Float32Array([0, 0, 0]) },
        uv: { size: 2, data: new Float32Array([0, 0, 0]) },
        index: { size: 1, data: new Uint16Array([0, 0, 0]) }
      })
    });

    if (_deferredSettings) {
      applySettings(_deferredSettings);
    }
  })();

  requestAnimationFrame(render);
})();

//Render loop
let i: number = 0;
let start = 0;
function render() {
  i++;
  overlay.ms(performance.now() - start);

  requestAnimationFrame(render);

  overlay.debug3d.draw();
  controls.update();
  renderer.render({ scene, camera });

  if (i % 30 === 0) localStorage["pdCamera"] = camera.position;

  start = performance.now();
}

export default {
  render: (model: TransferGeometry) => {
    gl.disable(gl.CULL_FACE);

    if (model && "position" in model && plant) {
      overlay.vertices(model.position.length / 3);

      if (showSkeleton && model.skeleton) {
        overlay.debug3d.skeleton = model.skeleton;
      }
      showIndices && (overlay.debug3d.points = model.position);

      if (model.leaf) {
        overlay.debug3d.uv = model.leaf.uv;
        if (true) {
          leafMesh.geometry = new Geometry(gl, {
            position: { size: 3, data: new Float32Array(model.leaf.position) },
            normal: { size: 3, data: new Float32Array(model.leaf.normal) },
            uv: { size: 2, data: new Float32Array(model.leaf.uv) },
            index: { size: 1, data: new Uint16Array(model.leaf.index) },

            offset: {
              instanced: 1,
              size: 3,
              data: new Float32Array(model.leaf.offset)
            },
            scale: {
              instanced: 1,
              size: 3,
              data: new Float32Array(model.leaf.scale)
            },
            rotation: {
              instanced: 1,
              size: 3,
              data: new Float32Array(model.leaf.rotation)
            }
          });
          leafMesh.geometry.setInstancedCount(model.leaf.offset.length / 3);
        } else {
          /*leaf.attributes.position.data = model.leaf.position;
          leaf.updateAttribute(leaf.attributes.position);
          leaf.attributes.normal.data = model.leaf.normal;
          leaf.updateAttribute(leaf.attributes.normal);
          leaf.attributes.uv.data = model.leaf.uv;
          leaf.updateAttribute(leaf.attributes.uv);
          leaf.attributes.index.data = model.leaf.index;
          leaf.updateAttribute(leaf.attributes.index);
          leaf.attributes.offset.data = model.leaf.offset;
          leaf.updateAttribute(leaf.attributes.offset);
          leaf.attributes.rotation.data = model.leaf.rotation;
          leaf.updateAttribute(leaf.attributes.rotation);
          leaf.attributes.scale.data = model.leaf.scale;
          leaf.updateAttribute(leaf.attributes.scale);

          leaf.setDrawRange(0, model.leaf.index.length);
          leaf.setInstancedCount(model.leaf.offset.length);*/
        }
      } else {
        leafMesh.geometry.setInstancedCount(0);
      }

      if (true) {
        plantMesh.geometry = new Geometry(gl, {
          position: { size: 3, data: new Float32Array(model.position) },
          normal: { size: 3, data: new Float32Array(model.normal) },
          uv: { size: 2, data: new Float32Array(model.uv) },
          index: { size: 1, data: new Uint32Array(model.index) }
        });
      } else {
        /*plant.attributes.position.data = model.position;
        plant.updateAttribute(plant.attributes.position);
        plant.attributes.normal.data = model.normal;
        plant.updateAttribute(plant.attributes.normal);
        plant.attributes.uv.data = model.uv;
        plant.updateAttribute(plant.attributes.uv);
        plant.attributes.index.data = model.index;
        plant.updateAttribute(plant.attributes.index);

        plant.setDrawRange(0, model.index.length);*/
      }
    }
  },
  update: applySettings
};
