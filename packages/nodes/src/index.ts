import { PlantNode } from '@plantarium/types';
import * as nodes from './nodes';
const _nodes = Object.values(nodes).map((node) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  //@ts-ignore
  node.compute = node.computeNode;
  return node;
}) as PlantNode[];
export default _nodes;
