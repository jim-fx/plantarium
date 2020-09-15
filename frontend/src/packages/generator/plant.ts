import { logger } from 'packages/helpers';
import { calculateNormals } from 'packages/geometry';

import executeSkeletonNode from './executeSkeletonNode';
import executeGeometryNode from './executeGeometryNode';
import createContext from './createContext';

const log = logger('gen.plant');

const isNode = (value): value is NodeResult => {
  return typeof value === 'object' && 'type' in value;
};

const handleSkeletonNode = (node, ctx: GeneratorContext) => {
  log('skeleton.' + node.type, node);

  const parameters = {};
  Object.entries(node.parameters).forEach(([key, value]) => {
    parameters[key] = isNode(value) ? handleSkeletonNode(value, ctx) : value;
  });
  node.parameters = parameters;

  node.result = executeSkeletonNode(node, ctx);

  log('skeleton.' + node.type + '.result', node.result);

  return node;
};

const handleGeometryNode = (node, ctx) => {
  log('geometry.' + node.type, node);

  const parameters = {};
  Object.entries(node.parameters).forEach(([key, value]) => {
    parameters[key] = isNode(value) ? handleGeometryNode(value, ctx) : value;
  });

  node.parameters = parameters;

  node.result = { ...node.result, ...executeGeometryNode(node, ctx) };

  log('geometry.' + node.type, node.result);

  return node;
};

export default function plant(rootNode: NodeResult, s: PlantariumSettings) {
  const a1 = performance.now();

  const ctx = createContext(s);

  const skelly = handleSkeletonNode(rootNode, ctx);

  log('final skeleton', skelly.result);

  const final = handleGeometryNode(skelly, ctx);

  log('geo', final);

  const { result } = final;

  result.geometry = calculateNormals(result.geometry);

  const a2 = performance.now();

  console.log(a2 - a1);

  return result;
}
