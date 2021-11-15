import { worker } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import Renderer from '@plantarium/renderer';
import { Box, Mesh, Geometry } from 'ogl';
import { MatCapShader } from '../components/scene/shaders';

const webWorker = worker();
const renderer = new Renderer({ width: 100, height: 100, alpha: true, clearColor: "000000" });
const nodeSystem = new NodeSystem({
  view: false,
  defaultNodes: false,
  registerNodes: Nodes,
});

const mesh = new Mesh(renderer.gl, {
  geometry: new Box(renderer.gl, { width: 0, height: 0, depth: 0 }),
  program: MatCapShader(renderer.gl),
});

mesh.setParent(renderer.scene);

export default async function({ pd, geo }: { pd?: PlantProject, geo?: TransferGeometry }) {
  nodeSystem.load(pd);

  const nodeResult = nodeSystem.result as NodeResult;

  let _geometry:TransferGeometry;

  if(geo){
    _geometry = geo;
  }
  
  if (pd && !_geometry) {
    const result = (await (await webWorker).plant(nodeResult, {
      stemResX: 12,
      stemResY: 12,
    })) as TransferGeometry;


    _geometry = result.geometry
  }

  if (!_geometry) return;

  mesh.geometry = transferToGeometry(renderer.gl, _geometry);

  mesh.geometry.computeBoundingBox();

  renderer.renderer.gl.clearColor(1, 0, 0, 0);

  // Make the bounding box of the plant fill the viewport of the camera
  renderer.camera.position.x = mesh.geometry.bounds.center.x;
  renderer.camera.position.y = mesh.geometry.bounds.center.y;
  const boundingHeight = (mesh.geometry.bounds.max.y - mesh.geometry.bounds.center.y) * 2;
  const camDistance = boundingHeight / 2 / Math.tan(Math.PI * renderer.camera.fov / 360);
  renderer.camera.position.z = camDistance;

  renderer.camera.lookAt(mesh.geometry.bounds.center);

  renderer.renderScene(renderer.scene);

  return renderer.canvas.toDataURL("image/webp", 0.7)

}
