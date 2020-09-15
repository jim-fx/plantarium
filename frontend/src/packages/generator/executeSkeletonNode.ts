import { inputChanged } from 'packages/helpers';
import Nodes from 'packages/nodes';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
  const { computeSkeleton } = n;
  if (computeSkeleton) {
    n.computeSkeleton = inputChanged(computeSkeleton);
  }
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes && nodes[node.type].computeSkeleton) {
    return nodes[node.type].computeSkeleton(node, ctx);
  }

  return node.input.result;
};
