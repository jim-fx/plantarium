import {
  Renderer,
  Camera,
  Orbit,
  Vec3,
  Transform,
  Texture,
  Program,
  Color,
  Geometry,
  Mesh
} from "ogl";

import ResizeObserver from "resize-observer-polyfill";
import debounce from "../../helpers/debounce";
import FogShader from "../../assets/FogShader";

export default function(canvas: HTMLCanvasElement) {
  const resize = debounce(
    () => {
      console.log("resizing");
      const b = canvas.parentElement.getBoundingClientRect();
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
    enablePan: false,
    element: canvas
  });

  const scene = new Transform();
  const texture = new Texture(gl);
  texture.wrapS = 1024;
  texture.wrapT = 1024;
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

  let mesh;
  loadModel();
  async function loadModel() {
    const model = await (await fetch(`assets/ground2.json`)).json();
    let data: any = {};

    if ("data" in model && "attributes" in model.data) {
      const { attributes } = model.data;
      Object.keys(attributes).forEach(k => {
        data[k] = attributes[k].array;
      });
    } else {
      data = model;
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: new Float32Array(data.position) },
      uv: { size: 2, data: new Float32Array(data.uv) }
    });
    mesh = new Mesh(gl, { geometry, program });
    window["mesh"] = mesh;
    mesh.setParent(scene);
  }
  requestAnimationFrame(update);

  function update(t: number) {
    requestAnimationFrame(update);
    program.uniforms.uTime.value = t * 0.001;
    controls.update();
    renderer.render({ scene, camera });
  }
}
