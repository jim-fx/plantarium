import { createWorker } from '@plantarium/generator';
import { calculateNormals, transferToGeometry } from '@plantarium/geometry';
import Renderer from '@plantarium/renderer';
import type { PlantProject, TransferGeometry } from '@plantarium/types';
import { Box, Mesh } from 'ogl-typescript';
import { NormalShader } from '../components/scene/shaders';

const webWorker = createWorker();

let renderer: Renderer;
let mesh: Mesh;
let ctx: CanvasRenderingContext2D;
let renderCanvas: HTMLCanvasElement;
let isSetup = false;

const RENDER_SIZE = 500;

function setup() {
  if (isSetup) return;
  isSetup = true;

  renderer = new Renderer({
    width: RENDER_SIZE,
    height: RENDER_SIZE,
    alpha: true,
    clearColor: '000',
  });
  mesh = new Mesh(renderer.gl, {
    geometry: new Box(renderer.gl, { width: 0, height: 0, depth: 0 }),
    program: NormalShader(renderer.gl),
  });

  renderCanvas = document.createElement('canvas');
  renderCanvas.width = renderCanvas.height = RENDER_SIZE;
  ctx = renderCanvas.getContext('2d') as CanvasRenderingContext2D;

  mesh.setParent(renderer.scene);

}

export default async function({
  pd,
  geo,
}: {
  pd?: PlantProject;
  geo?: TransferGeometry;
}) {

  setup()

  let _geometry: TransferGeometry | undefined = geo;


  if (!_geometry && pd) {
    const result = await webWorker.executeNodeSystem(pd, { stemResX: 12, stemResY: 12 });

    _geometry = result.geometry;
  }

  if (!_geometry) return;

  mesh.geometry = transferToGeometry(renderer.gl, calculateNormals(_geometry));

  await new Promise((r) => setTimeout(r, 200));

  mesh.geometry.computeBoundingBox();

  // Make the bounding box of the plant fill the viewport of the camera
  renderer.camera.fov = 10;
  renderer.camera.position.x = mesh.geometry.bounds.max.x;
  renderer.camera.position.y = mesh.geometry.bounds.max.y;
  const radius = Math.max(mesh.geometry.bounds.max.x - mesh.geometry.bounds.min.x, mesh.geometry.bounds.max.y - mesh.geometry.bounds.min.y) / 2;
  const camDistance = radius * Math.tan(Math.PI - renderer.camera.fov / 2) * 0.5;
  renderer.camera.position.z = camDistance;

  renderer.camera.lookAt(mesh.geometry.bounds.center);
  await new Promise(res => setTimeout(res, 50));

  renderer.renderScene(renderer.scene);

  await new Promise(res => setTimeout(res, 50));

  if (renderer.canvas.width === 0 || renderer.canvas.height === 0) return;
  //
  ctx.clearRect(0, 0, RENDER_SIZE, RENDER_SIZE);
  ctx.drawImage(renderer.canvas, 0, 0);

  return renderCanvas.toDataURL('image/webp', 0.9);
}
