import Nodes from 'packages/nodes';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes && nodes[node.type].computeGeometry) {
    return nodes[node.type].computeGeometry(node, ctx);
  }

  return node.parameters.input.result;
};
