export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeRef {
  id: string;
  in: string;
  out: number;
}

/**
* Serialized version of a node
*/
export interface NodeProps {
  attributes: NodeAttributes;
  state?: unknown;
}


/**
 * Common attributes across all nodes
 * should not have an effect on computing
 */
export interface NodeAttributes {
  id: string;
  type: string;
  name?: string;
  pos?: NodePosition;
  refs?: NodeRef[];
  visible?: string[]
}
