import { inputChanged } from '@plantarium/helpers';
import Nodes from '@plantarium/nodes';
const nodes: { [type: string]: PlantNode } = {};

Nodes.forEach((n) => {
  nodes[n.type] = n;
  if ('computeSkeleton' in n) {
    n.computeSkeleton = inputChanged(n.computeSkeleton);
  }
  if ('computeGeometry' in n) {
    n.computeGeometry = inputChanged(n.computeGeometry);
  }
  if ('computeValue' in n) {
    n.computeValue = inputChanged(n.computeValue);
  }
});
export default nodes;
