import { NodeProps } from "./nodesystem";

/**
 * Geometry which gets passed directly to the render engine
 */
export interface Geometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
}

export interface TransferGeometry extends Geometry {
  skeleton?: Float32Array[];
  instances?: InstancedGeometry[];
}

export interface InstancedGeometry extends Geometry {

  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;

  id: string,
  depth: number,
  baseAlpha: Float32Array
}

export interface PlantStem {
  /**
   * How many layers deep is this stem, eg parent->parent->parent = 3
   */
  depth: number;
  /**
   * Each stem groups gets a unique id like this grandParentId>parentId>myId;
   */
  id: string;
  /**
   * Where along the parent stem is this stem attached?
   */
  baseAlpha: number;
  /**
   * Actual data of the stem
   */
  skeleton: Float32Array;
}

export interface Vec2 {
  x: number;
  y: number;
  pinned?: boolean;
}

export interface Vec3 {
  x: number;
  y: number;
  z: number;
  pinned?: boolean;
}

export interface Project {
  id: string;
  type: number;
  public: boolean;
  author?: string;
  updatedAt: Date;
  createdAt: Date;
  meta: ProjectMeta;
  nodes: NodeProps[];
  likes: string[];
  history?: any;
}

export interface ProjectMeta {
  name: string;

  thumbnail?: string;

  description?: string;

  transform?: {
    x: number;
    y: number;
    s: number;
  };
  plantariumVersion?: string;
  gbifID?: number;
  seed?: number;
  randomSeed?: boolean;
  scientificName?: string;
  family?: string;
  class?: string;
  tags?: string[]
}

