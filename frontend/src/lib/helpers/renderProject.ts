import { createWorker } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import Renderer from '@plantarium/renderer';
import type { PlantProject, TransferGeometry } from '@plantarium/types';
import { Box, Mesh } from 'ogl-typescript';
import { MatCapShader } from '../components/scene/shaders';

const webWorker = createWorker();

let renderer: Renderer;
let mesh: Mesh;
let ctx: CanvasRenderingContext2D;
let renderCanvas: HTMLCanvasElement;
let isSetup = false;
function setup() {
  if (isSetup) return;
  isSetup = true;

  renderer = new Renderer({
    width: 100,
    height: 100,
    alpha: true,
    clearColor: '000',
  });
  mesh = new Mesh(renderer.gl, {
    geometry: new Box(renderer.gl, { width: 0, height: 0, depth: 0 }),
    program: MatCapShader(renderer.gl),
  });

  renderCanvas = document.createElement('canvas');
  renderCanvas.width = renderCanvas.height = 100;
  ctx = renderCanvas.getContext('2d');

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

  let _geometry: TransferGeometry;

  if (geo) {
    _geometry = geo;
  }

  if (!_geometry) {
    const result = await webWorker.executeNodeSystem(pd, { stemResX: 12, stemResY: 12 });

    _geometry = result.geometry;
  }

  if (!_geometry) return;

  mesh.geometry = transferToGeometry(renderer.gl, _geometry);

  mesh.geometry.computeBoundingBox();

  // Make the bounding box of the plant fill the viewport of the camera
  renderer.camera.fov = 10;
  renderer.camera.position.x = mesh.geometry.bounds.center.x;
  renderer.camera.position.y = mesh.geometry.bounds.center.y;
  const boundingHeight = mesh.geometry.bounds.max.y - mesh.geometry.bounds.min.y;
  const camDistance = boundingHeight / 2 / Math.tan((Math.PI * renderer.camera.fov) / 360);
  renderer.camera.position.z = camDistance / 5;

  renderer.camera.lookAt(mesh.geometry.bounds.center);

  renderer.renderScene(renderer.scene);

  await new Promise(res => setTimeout(res, 100));

  if (renderer.canvas.width === 0 || renderer.canvas.height === 0) return;
  //
  ctx.clearRect(0, 0, 100, 100);
  ctx.drawImage(renderer.canvas, 0, 0);

  return renderCanvas.toDataURL('image/webp', 1.0);
}
