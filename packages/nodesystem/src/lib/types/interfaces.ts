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

export interface CustomMouseEvent {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  mx: number;
  my: number;
  target?: HTMLElement,
  keys: {
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    button: number;
    [x: string]: boolean | number;
  };
}


export interface HistoryData {
  index: number;
  steps: { next: Partial<NodeProps>; previous: Partial<NodeProps> }[];
}

export interface NodeSystemData {
  meta: NodeSystemMeta;
  nodes: NodeProps[];
  history?: HistoryData;
}

export interface NodeSystemMeta {
  lastSaved?: number;
  drawings?: number[][];
  transform?: {
    x: number;
    y: number;
    s: number;
  };
}

export interface Vec2 {
  x: number;
  y: number;
  pinned?: boolean;
}


export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
