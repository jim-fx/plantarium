import { PlantNode } from "@plantarium/nodes";
import { NodeProps } from "@plantarium/nodesystem";

export type WrappedNode = {
  // Internal Shit
  attributes: NodeProps["attributes"],
  state: NodeProps["state"],

  id: string,
  type: string,
  level: number,
  buckets?: WrappedNode[][]

  exec: PlantNode

  parameters?: Record<string, any>,
  results: any[]
}
