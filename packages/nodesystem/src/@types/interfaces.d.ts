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

interface Vec2 {
  x: number;
  y: number;
  pinned?: boolean;
}

interface ValueTemplate {
  type: string;
  label?: boolean | string;
  value?: boolean | string | number;
  values?: string[];
  points?: Vec2[];
  isAccessible?: boolean;
  external?: boolean;
  internal?: boolean;
  inputType?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string | boolean;
}

/**
 * Used to register new node types
 */
interface NodeTypeData {
  title: string;

  type: string;

  outputs: string | string[];

  meta?: {
    description?: string;
    tags?: string[];
  };

  parameters: {
    [key: string]: ValueTemplate;
  };

  compute(parameters: { [key: string]: unknown }): unknown;
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
