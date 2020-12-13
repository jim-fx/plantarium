import { inputChanged } from '@plantarium/helpers';
import Nodes from '@plantarium/nodes';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
  const { computeGeometry } = n;
  if (computeGeometry) {
    n.computeGeometry = inputChanged(computeGeometry);
  }
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes && nodes[node.type].computeGeometry) {
    return nodes[node.type].computeGeometry(node, ctx);
  }

  return node.parameters.input.result;
};
