//@ts-ignore
import { Renderer, Camera, Orbit, Vec3, Transform, Texture, Program, Color, Geometry, Mesh, Sphere } from "ogl";

import ResizeObserver from "resize-observer-polyfill";
import debounce from "../../helpers/debounce";
import FogShader from "../../assets/FogShader";
import BasicShader from "../../assets/BasicShader";
import overlay from "./overlay";

function convertFromThree(model: any) {
  if ("data" in model && "attributes" in model.data) {
    const data: any = {};
    const { attributes } = model.data;
    Object.keys(attributes).forEach(k => {
      data[k] = attributes[k].array;
    });
    return data;
  } else {
    return model;
  }
}

function customControls(canvas: HTMLCanvasElement, vec: any, max: any, min: any) {
  let mouseDown: boolean = false;
  const downVec = {
    x: 0,
    y: 0
  };
  let downY = vec[1];

  let h = canvas.height;

  canvas.addEventListener("mousedown", ev => {
    if (ev.button == 2) {
      downY = vec[1];
      h = canvas.height;
      downVec.x = ev.pageX;
      downVec.y = ev.pageY;
      mouseDown = !mouseDown;
    }
  });

  canvas.addEventListener("mouseup", () => {
    mouseDown = false;
  });

  canvas.addEventListener("mousemove", ev => {
    if (mouseDown) {
      vec[1] = Math.max(Math.min(downY + ((downVec.y - ev.pageY) / h) * 10, max[1]), min[1]);
    }
  });
}

export default function(canvas: HTMLCanvasElement) {
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

  const b = canvas.getBoundingClientRect();

  const renderer = new Renderer({
    width: b.width,
    antialias: true,
    height: b.height,
    canvas: canvas
  });
  const gl = renderer.gl;
  gl.clearColor(1, 1, 1, 1);

  const camera = new Camera(gl, { fov: 70, aspect: b.width / b.height });
  camera.position.set(0, 2, 4);
  camera.lookAt([0, 0, 0]);

  const controls = new Orbit(camera, {
    target: new Vec3(0, 0.2, 0),
    maxPolarAngle: 1.6,
    minDistance: 1,
    maxDistance: 15,
    enablePan: false,
    element: canvas
  });

  const scene = new Transform();
  const texture = new Texture(gl, {
    wrapS: gl.REPEAT,
    wrapT: gl.REPEAT
  });
  const img = new Image();
  img.onload = () => (texture.image = img);
  img.src = "assets/rocky_dirt1-albedo.png";

  const program = new Program(gl, {
    vertex: FogShader.vertex,
    fragment: FogShader.fragment,
    uniforms: {
      uTime: { value: 0 },
      tMap: { value: texture },
      // Pass relevant uniforms for fog
      uFogColor: { value: new Color("#ffffff") },
      uFogNear: { value: 10 },
      uFogFar: { value: 30 }
    }
  });

  const basicProgram = new Program(gl, {
    vertex: BasicShader.vertex,
    fragment: BasicShader.fragment,
    uniforms: {
      uTime: { value: 0 },
      tMap: { value: texture },
      // Pass relevant uniforms for fog
      uFogColor: { value: new Color("#ffffff") },
      uFogNear: { value: 10 },
      uFogFar: { value: 30 }
    }
  });

  let plantMesh;

  loadModel();
  async function loadModel() {
    const plant = convertFromThree(await (await fetch(`assets/plant.json`)).json());

    const plantGeometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(plant.position) },
      normal: { size: 3, data: new Float32Array(plant.normal) },
      uv: { size: 2, data: new Float32Array(plant.uv) }
    });
    plantMesh = new Mesh(gl, {
      geometry: plantGeometry,
      program: basicProgram
    });
    plantMesh.setParent(scene);
    plantMesh.geometry.computeBoundingBox();
    controls.target[1] = plantMesh.geometry.bounds.max[2] / 2;

    const s = new Sphere(gl, {
      radius: 0.2,
      widthSegments: 4,
      heightSegments: 4
    });

    window.gl = gl;

    const mesh = new Mesh(gl, { geometry: s, program: basicProgram });
    mesh.setParent(scene);

    customControls(canvas, controls.target, plantMesh.geometry.bounds.max, plantMesh.geometry.bounds.min);

    /*const ground = convertFromThree(await (await fetch(`assets/ground2.json`)).json());
    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(ground.position) },
      uv: { size: 2, data: new Float32Array(ground.uv) }
    });*/
    //const mesh = new Mesh(gl, { geometry, program });
    //mesh.setParent(scene);
  }
  requestAnimationFrame(update);

  let start = 0;
  function update(t: number) {
    overlay.ms(performance.now() - start);
    requestAnimationFrame(update);
    program.uniforms.uTime.value = t * 0.001;
    controls.update();
    renderer.render({ scene, camera });
    start = performance.now();
  }

  return {
    render: (model: transferGeometry) => {
      let geo: any = {
        position: { size: 3, data: new Float32Array(model.position) }
      };

      if ("normal" in model) {
        geo.normal = { size: 3, data: new Float32Array(model.normal) };
      }

      if ("uv" in model) {
        geo.uv = { size: 2, data: new Float32Array(model.uv) };
      }
      if ("index" in model) {
        geo.index = { size: 1, data: new Uint16Array(model.index) };
      }

      if (plantMesh) {
        plantMesh.geometry = new Geometry(gl, geo);
      }
    }
  };
}
