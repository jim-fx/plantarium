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
  value: number;
  variation?: number;
  shape?: Point[];
  curve?: Point[];
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

interface PlantPartParameters {
  stem: PlantPartParameters;
  length: number | Parameter;
  size: number | Parameter;
  thiccness: number | Parameter;
}

export interface PartDescription {
  type: string;
  props: PlantPartParameters;
}

export interface PlantDescription {
  meta: PlantMetaInfo;
  main: PartDescription;
}

export interface PlantariumSettings {
  useRandomSeed: boolean;
  seed: number;

  forceUpdate: boolean;

  debugWireframe: boolean;
  debugIndices: boolean;
  debugRenderPerf: boolean;
  debugGeneratePerf: boolean;
  debugPd: boolean;
  debugSkeleton: boolean;
  debugDisableModel: boolean;
  debugGrid: boolean;
  debugGridSize: number;
  debugGridResolution: number;
  debugUv: number;

  ground: {
    enable: boolean;
    resX: number;
    resY: number;
    scale: number;
    textureSize: number;
  };

  expUseRandomSeed: boolean;
  expFiletype: string;
  expSeed: string;

  stemResX: number;
  stemResY: number;
  leafResX: number;
  leafResY: number;
}

import './ogl';
