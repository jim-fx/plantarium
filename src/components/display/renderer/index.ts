import { Renderer, Camera, Orbit, Vec3, Transform, Texture, Program, Color, Geometry, Mesh } from "ogl";
import { FogShader, BasicShader, InstanceShader } from "./shaders";
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
let plant: Geometry;
let plantMesh: Mesh;
let ground: Mesh;
let gl: WebGL2RenderingContext;
let leaf: Geometry;
let leafMesh: Mesh;

let start = 0;

let showIndices: boolean;
let showSkeleton: boolean;

let gridSize: number = 5;
let gridResolution: number = 8;
let gridMesh: Mesh;

let _deferedSettings: settings;
function applySettings(_s: settings) {
  _deferedSettings = _s;
  if (plant) {
    if (_s["debug_wireframe"]) {
      plantMesh.mode = gl.LINES;
      leafMesh.mode = gl.LINES;
    } else {
      plantMesh.mode = gl.TRIANGLES;
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

  if (ground) {
    if (_s["debug_disable_ground"]) {
      ground.scale.set(0, 0, 0);
    } else {
      ground.scale.set(1, 1, 1);
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

  if (localStorage.pdCamera) camera.position.fromArray(localStorage.pdCamera.split(",").map((v: string) => parseFloat(v)));

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

    //Load the ground/dirt texture (from freepbr.com)
    const groundTexture = new Texture(gl, {
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT
    });
    const img = new Image();
    img.onload = () => (groundTexture.image = img);
    img.src = "assets/rocky_dirt1-albedo.jpg";

    const basicShader = new Program(gl, {
      vertex: BasicShader.vertex,
      fragment: BasicShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: groundTexture }
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
      offset: { instanced: 1, size: 3, data: new Float32Array([0, 0, 0, 1, 1, 1]) },
      rotation: { instanced: 1, size: 3, data: new Float32Array([0, 0, 0, 1, 1, 1]) },
      scale: { instanced: 1, size: 3, data: new Float32Array([0, 0, 0, 1, 1, 1]) }
    });

    const leafTexture = new Texture(gl, {
      wrapS: gl.REPEAT,
      wrapT: gl.REPEAT
    });
    const leafImg = new Image();
    leafImg.onload = () => (leafTexture.image = leafImg);
    leafImg.src = "assets/leaf.jpg";

    const instanceShader = new Program(gl, {
      vertex: InstanceShader.vertex,
      fragment: InstanceShader.fragment,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: leafTexture }
      }
    });

    leafMesh = new Mesh(gl, {
      geometry: leaf,
      program: instanceShader
    });

    leafMesh.setParent(scene);

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

    applySettings(_deferedSettings);
    //Instantiate custom controls (up/down movement)
    customControls(canvas, controls.target, plant);
  })();

  requestAnimationFrame(render);
})();

let i: number = 0;

//Render loop
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

            offset: { instanced: 1, size: 3, data: new Float32Array(model.leaf.offset) },
            scale: { instanced: 1, size: 3, data: new Float32Array(model.leaf.scale) },
            rotation: { instanced: 1, size: 3, data: new Float32Array(model.leaf.rotation) }
          });
        } else {
          leaf.attributes.position.data = model.leaf.position;
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
          leaf.setInstancedCount(model.leaf.offset.length);
        }
      }

      if (true) {
        plantMesh.geometry = new Geometry(gl, {
          position: { size: 3, data: new Float32Array(model.position) },
          normal: { size: 3, data: new Float32Array(model.normal) },
          uv: { size: 2, data: new Float32Array(model.uv) },
          index: { size: 1, data: new Uint16Array(model.index) }
        });
      } else {
        plant.attributes.position.data = model.position;
        plant.updateAttribute(plant.attributes.position);
        plant.attributes.normal.data = model.normal;
        plant.updateAttribute(plant.attributes.normal);
        plant.attributes.uv.data = model.uv;
        plant.updateAttribute(plant.attributes.uv);
        plant.attributes.index.data = model.index;
        plant.updateAttribute(plant.attributes.index);

        plant.setDrawRange(0, model.index.length);
      }
    }
  },
  update: applySettings
};
