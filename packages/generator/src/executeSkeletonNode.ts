import { inputChanged, logger } from '@plantarium/helpers';
import Nodes from '@plantarium/nodes';

const nodes: { [type: string]: PlantNode } = {};

const log = logger("gen.skeleton");

Nodes.forEach((n) => {
  nodes[n.type] = n;
  if ("computeSkeleton" in n) {
    n.computeSkeleton = inputChanged(n.computeSkeleton);
  }
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes && nodes[node.type].computeSkeleton) {
    return nodes[node.type].computeSkeleton(node, ctx);
  }else{
    log.warn(`cant find node for ${node.type}`);
  }

  return node.input.result;
};
