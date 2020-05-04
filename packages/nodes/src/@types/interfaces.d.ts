/**
 * Common attributes across all nodes
 * should not have an effect on computing
 */
interface NodeAttributes {
  id: string;
  type: string;
  name?: string;
  pos?: NodePosition;
  refs?: NodeRef[];
}

interface CustomMouseEvent {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  keys: {
    shiftKey: boolean;
    ctrlKey: boolean;
    [x: string]: boolean;
  };
}

/**
 * Serialized version of a node
 */
interface NodeProps {
  attributes: NodeAttributes;
  state?: any;
}

interface NodeSystemData {
  meta: NodeSystemMeta;
  nodes: NodeProps[];
}

interface NodeSystemMeta {
  lastSaved: number;
  transform?: {
    x: number;
    y: number;
    s: number;
  };
}

/**
 * Used to register new node types
 */
interface NodeTypeData {
  name: string;

  meta?: {
    description?: string;
    tags?: string[];
  };
  state?: any;

  inputs?: (string[] | string)[];

  outputs?: string[];

  compute(inputData: any[], state?: any): any;
  initView?(node: any);
}

interface NodePosition {
  x: number;
  y: number;
}

interface NodeRef {
  id: string;
  in: number;
  out: number;
}

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
