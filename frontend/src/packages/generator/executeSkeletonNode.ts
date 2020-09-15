import Nodes from 'packages/nodes';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes && nodes[node.type].computeSkeleton) {
    return nodes[node.type].computeSkeleton(node, ctx);
  }

  return node.input.result;
};
