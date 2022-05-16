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
}

export interface CustomMouseEvent {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  mx: number;
  my: number;
  keys: {
    shiftKey: boolean;
    ctrlKey: boolean;
    [x: string]: boolean;
  };
}

/**
 * Serialized version of a node
 */
export interface NodeProps {
  attributes: NodeAttributes;
  state?: unknown;
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

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeRef {
  id: string;
  in: string;
  out: number;
}

export interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
