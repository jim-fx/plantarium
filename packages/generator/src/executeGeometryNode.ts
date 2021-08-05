import Nodes from '@plantarium/nodes';
import { inputChanged } from '../../helpers/src';

const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
  if ('computeGeometry' in n) {
    n.computeGeometry = inputChanged(n.computeGeometry);
  }
});

export default (node, ctx: GeneratorContext) => {
  if (node.type in nodes && nodes[node.type].computeGeometry) {
    return nodes[node.type].computeGeometry(node, ctx);
  }

  return node.parameters.input.result;
};
