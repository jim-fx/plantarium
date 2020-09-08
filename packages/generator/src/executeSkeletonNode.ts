import Nodes from '@plantarium/nodes';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
});

export default (node: SkeletonResult, ctx: GeneratorContext) => {
  if (node.type in nodes) {
    return nodes[node.type].computeSkeleton(node, ctx);
  }

  return node.result;
};
