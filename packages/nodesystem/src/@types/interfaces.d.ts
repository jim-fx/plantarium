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

interface NodeSystemData {
  meta: NodeSystemMeta;
  nodes: NodeProps[];
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

interface ValueTemplate {
  type: string | string[];
  label?: boolean | string;
  value?: boolean | string | number | Vec2[];
  values?: string[];
  points?: Vec2[];
  internal?: boolean;
  external?: boolean;
  inputType?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number | string | boolean | Vec3[] | Vec2[] | Vec3;
}

/**
 * Used to register new node types
 */
interface NodeTypeData {
  title: string;

  type: string;

  outputs: string[];

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
