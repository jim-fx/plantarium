import type { NodeProps } from "@plantarium/nodesystem"

/**
 * Result of a node which returns geometry
 */
export interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
  skeleton?: Float32Array[];
  instances?: InstancedGeometry[];
}

export interface InstancedGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
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
  nodes: NodeProps[];
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

export interface PlantariumSettings {
  seed: number;
  useRandomSeed: boolean;

  stemResX: number;
  stemResY: number;
  leafRes: number;

  grid: {
    enable: boolean;
    gridSize: number;
    gridResolution: number;
  };

  forceUpdate: boolean;

  debug: {
    showLogs: boolean;
    wireframe: boolean;
    indices: boolean;
    renderPerf: boolean;
    generatePerf: boolean;
    pd: boolean;
    logLevel: number;
    skeleton: boolean;
    disableModel: boolean;
    uv: number;
  };

  background: {
    grid: boolean;
    ground: boolean;
    resX: number;
    resY: number;
    scale: number;
    textureSize: number;
  };

  export: {
    filetype: string;
  };
}

export interface PlantStem {
  depth: number;
  id: string;
  skeleton: Float32Array;
}
