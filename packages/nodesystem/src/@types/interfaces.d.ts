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
interface NodeProps {
  attributes: NodeAttributes;
  state?: unknown;
}

interface HistoryData {
  index: number;
  steps: { next: Partial<NodeProps>; previous: Partial<NodeProps> }[];
}

interface NodeSystemData {
  meta: NodeSystemMeta;
  nodes: NodeProps[];
  history?: HistoryData;
}

interface NodeSystemMeta {
  lastSaved?: number;
  transform?: {
    x: number;
    y: number;
    s: number;
  };
}

interface Vec2 {
  x: number;
  y: number;
  pinned?: boolean;
}

interface NodePosition {
  x: number;
  y: number;
}

interface NodeRef {
  id: string;
  in: string;
  out: number;
}

interface Rect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
