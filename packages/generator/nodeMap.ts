import { inputChanged } from "@plantarium/helpers";
import Nodes, { type PlantNode } from "@plantarium/nodes"

const nodeMap = new Map<string, PlantNode>()
for (const n of Nodes) {

  if (n.compute) {
    n.compute = inputChanged(n.compute)
  }
  nodeMap.set(n.type, n)
}

export default nodeMap;

