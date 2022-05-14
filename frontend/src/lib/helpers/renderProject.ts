import { createWorker } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import Renderer from '@plantarium/renderer';
import { Box, Mesh } from 'ogl';
import { MatCapShader } from '../components/scene/shaders';

const webWorker = createWorker();
const renderer = new Renderer({
  width: 100,
  height: 100,
  alpha: true,
  clearColor: '000',
});
const nodeSystem = new NodeSystem({
  view: false,
  defaultNodes: false,
  deferCompute: true,
  registerNodes: Nodes,
});

const mesh = new Mesh(renderer.gl, {
  geometry: new Box(renderer.gl, { width: 0, height: 0, depth: 0 }),
  program: MatCapShader(renderer.gl),
});

const renderCanvas = document.createElement('canvas');
renderCanvas.width = renderCanvas.height = 100;
const ctx = renderCanvas.getContext('2d');

mesh.setParent(renderer.scene);

export default async function({
  pd,
  geo,
}: {
  pd?: PlantProject;
  geo?: TransferGeometry;
}) {

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

  if (renderer.canvas.width === 0 || renderer.canvas.height === 0) return;
  //
  ctx.clearRect(0, 0, 100, 100);
  for (let i = 0; i < 1; i++) {
    ctx.drawImage(renderCanvas, 0, 0);
    ctx.drawImage(renderer.canvas, 0, 0);
    ctx.filter = 'blur(7px) opacity(0.6) brightness(0.95)';
  }
  ctx.filter = 'blur(0px) drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.8))';

  ctx.drawImage(renderer.canvas, 0, 0);

  return renderCanvas.toDataURL('image/webp', 1.0);
}
