export interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: InstancedGeometry;
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

export interface ParameterResult {
  value: number | number[];
  variation?: number;
  curve?: Point[];
}

/**
 * Output of a node
 */
export interface NodeResult {
  type: string;
  parameters: {
    [key: string]: ValueResult;
  };
}

export interface GeneratorContext {
  handleParameter(param: ParameterResult, alpha?: number): number;
  getSetting(key: string): number;
  readonly seed: number;
  refresh(): number;
}

export interface ValueTemplate {
  type: string | string[];
  label?: boolean | string;
  value?: boolean | string | number;
  values?: string[];
  points?: Point[];
  internal?: boolean;
  external?: boolean;
  inputType?: string;
  min?: number;
  max?: number;
  step?: number;
}

export type ValueResult = NodeResult | ParameterResult | string;

export interface Point {
  x: number;
  y: number;
  pinned?: boolean;
}

export interface PlantDescription {
  meta: PlantMetaInfo;
  main: NodeResult;
}

export interface PlantMetaInfo {
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

  export: {
    filetype: string;
  };
}
