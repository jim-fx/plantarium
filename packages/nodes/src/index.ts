import * as nodes from './nodes';
const _nodes = Object.values(nodes).map((node) => {
  if ('computeNode' in node) {
    node.compute = node.computeNode;
  } else {
    node.compute = (parameters) => ({
      type: node.type,
      parameters,
    });
  }
  return node;
}) as PlantNode[];
export default _nodes;
