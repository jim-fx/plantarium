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

export interface PlantProject {
  meta: PlantProjectMeta;
  nodes: any[];
  history?: any;
}

export interface PlantProjectMeta {
  name: string;

  id: string;

  authorID?: string;

  thumbnail?: string;

  transform?: {
    x: number;
    y: number;
    s: number;
  };
  active?: boolean;
  plantariumVersion?: string;
  seed?: number;
  randomSeed?: boolean;
  lastSaved?: number;
  author?: string;
  latinName?: string;
  family?: string;
  class?: string;
  public?: boolean;
}


