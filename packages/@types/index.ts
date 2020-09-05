export interface InstancedGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
}

interface InstanceGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
}

export interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: InstanceGeometry;
}

export interface Point {
  x: number;
  y: number;
}

export interface Parameter {
  value: number | number[];
  variation?: number;
}

interface PlantMetaInfo {
  name: string;

  id: string;

  authorID: string;

  plantariumVersion?: string;
  seed?: number;
  randomSeed?: boolean;
  lastSaved?: string;
  author?: string;
  latinName?: string;
  family?: string;
  class?: string;
  public?: boolean;
}

type PartDescription = {};

export interface PlantDescription {
  meta: PlantMetaInfo;
  main: PartDescription;
}

export interface PlantariumSettings {
  useRandomSeed: boolean;
  seed: number;

  stemResX: number;
  stemResY: number;
  leafResX: number;
  leafResY: number;

  grid: {
    enable: boolean;
    gridSize: number;
    gridResolution: number;
  };

  forceUpdate: boolean;

  debugWireframe: boolean;
  debugIndices: boolean;
  debugRenderPerf: boolean;
  debugGeneratePerf: boolean;
  debugPd: boolean;
  debugSkeleton: boolean;
  debugDisableModel: boolean;
  debugUv: number;

  ground: {
    enable: boolean;
    resX: number;
    resY: number;
    scale: number;
    textureSize: number;
  };

  exportUseRandomSeed: boolean;
  exportFiletype: string;
  exportSeed: string;
}

import './ogl';
