import { worker } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import Renderer from '@plantarium/renderer';
import { Box, Mesh } from 'ogl';
import { MatCapShader } from '../components/scene/shaders';

const webWorker = worker();
const renderer = new Renderer({
  width: 100,
  height: 100,
  alpha: true,
  clearColor: '000',
});
const nodeSystem = new NodeSystem({
  view: false,
  defaultNodes: false,
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

export default async function ({
  pd,
  geo,
}: {
  pd?: PlantProject;
  geo?: TransferGeometry;
}) {
  nodeSystem.load(pd);

  const nodeResult = nodeSystem.result as NodeResult;

  let _geometry: TransferGeometry;

  if (geo) {
    _geometry = geo;
  }

  if (pd && !_geometry) {
    const result = (await (
      await webWorker
    ).plant(nodeResult, {
      stemResX: 12,
      stemResY: 12,
    })) as TransferGeometry;

    _geometry = result.geometry;
  }

  if (!_geometry) return;

  mesh.geometry = transferToGeometry(renderer.gl, _geometry);

  mesh.geometry.computeBoundingBox();

  // Make the bounding box of the plant fill the viewport of the camera
  renderer.camera.position.x = mesh.geometry.bounds.center.x;
  renderer.camera.position.y = mesh.geometry.bounds.center.y;
  const boundingHeight =
    (mesh.geometry.bounds.max.y - mesh.geometry.bounds.center.y) * 2;
  const camDistance =
    boundingHeight / 2 / Math.tan((Math.PI * renderer.camera.fov) / 360);
  renderer.camera.position.z = camDistance;

  renderer.camera.lookAt(mesh.geometry.bounds.center);

  renderer.renderScene(renderer.scene);

  ctx.clearRect(0, 0, 100, 100);
  for (let i = 0; i < 1; i++) {
    ctx.drawImage(renderCanvas, 0, 0);
    ctx.drawImage(renderer.canvas, 0, 0);
    ctx.filter = 'blur(7px) opacity(0.6) brightness(0.95)';
  }
  ctx.filter = 'blur(0px) drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.8))';

  if (renderer.canvas.width === 0 || renderer.canvas.height === 0) return;

  ctx.drawImage(renderer.canvas, 0, 0);

  return renderCanvas.toDataURL('image/webp', 1.0);
}
