import { calculateNormals } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import createContext from './createContext';
import executeGeometryNode from './executeGeometryNode';
import executeSkeletonNode from './executeSkeletonNode';

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
  const a = performance.now();

  const ctx = createContext(s);

  const skelly = handleSkeletonNode(rootNode, ctx);

  log('final skeleton', skelly.result);

  const final = handleGeometryNode(skelly, ctx);

  log('geo', final);

  const { result } = final;

  result.geometry = calculateNormals(result.geometry);

  log('generated in ', Math.floor((performance.now() - a) * 10) / 10, 'ms');

  return result;
}
