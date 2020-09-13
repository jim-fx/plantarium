import Nodes from '@plantarium/nodes';
import { GeneratorContext, PlantNode } from '@plantarium/types';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes) {
    return nodes[node.type].computeGeometry(node, ctx);
  }

  return node.result;
};
