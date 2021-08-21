import { worker } from '@plantarium/generator';
import { transferToGeometry } from '@plantarium/geometry';
import Nodes from '@plantarium/nodes';
import { NodeSystem } from '@plantarium/nodesystem';
import Renderer from '@plantarium/renderer';
import { Box, Mesh } from 'ogl';
import { MatCapShader } from '../components/scene/shaders';

const webWorker = worker();
const renderer = new Renderer({ width: 100, height: 100 });
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

export default async function (pd: PlantProject) {
  nodeSystem.load(pd);

  const nodeResult = nodeSystem.result as NodeResult;

  const result = (await webWorker.plant(nodeResult, {
    stemResX: 12,
    stemResY: 12,
  })) as TransferGeometry;

  mesh.geometry = transferToGeometry(renderer.gl, result);

  renderer.renderScene(renderer.scene);

  document.body.appendChild(renderer.canvas);
}
