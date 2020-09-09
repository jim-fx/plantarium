import { logger } from '@plantarium/helpers';
import { calculateNormals } from '@plantarium/geometry';
import {
  GeneratorContext,
  NodeResult,
  PlantariumSettings,
} from '@plantarium/types';

import executeSkeletonNode from './executeSkeletonNode';
import executeGeometryNode from './executeGeometryNode';
import createContext from 'createContext';

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

  log('skeleton.' + node.type, node.result);

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
  const ctx = createContext(s);
  console.log(rootNode, ctx);

  const skelly = handleSkeletonNode(rootNode, ctx);

  log('final skeleton', skelly);

  const final = handleGeometryNode(skelly, ctx);

  log('geo', final);

  const { result } = final;

  result.geometry = calculateNormals(result.geometry);

  return result;
}
