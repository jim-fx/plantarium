import { inputChanged } from "@plantarium/helpers";
import Nodes, { type PlantNode } from "@plantarium/nodes"

const nodeMap = new Map<string, PlantNode>()
for (const n of Nodes) {

  if (n.computeStem) {
    n.computeStem = inputChanged(n.computeStem)
  }

  if (n.computeGeometry) {
    n.computeGeometry = inputChanged(n.computeGeometry)
  }

  if (n.computeValue) {
    n.computeValue = inputChanged(n.computeValue)
  }
  nodeMap.set(n.type, n)
}

export default nodeMap;

