interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;

  skeleton?: Float32Array[];

  leaf?: InstancedGeometry;
}

interface InstancedGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
  offset: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
}

interface ParameterResult {
  value: number | number[];
  variation?: number;
  curve?: Point[];
}

/**
 * Result of the skeleton phase of the Generator
 */
interface SkeletonResult extends NodeResult {
  result: {
    skeletons?: Float32Array[];
  };
  parameters: {
    [key: string]: SkeletonResult | ParameterResult | string;
  };
}

/**
 * Result of the geometry phase of the Generator
 */
interface GeometryResult extends SkeletonResult {
  result: {
    skeletons?: Float32Array[];
    geometry?: TransferGeometry;
  };
  parameters: {
    [key: string]: GeometryResult | ParameterResult | string;
  };
}

interface PlantNode {
  name: string;
  type: string;

  outputs: string[];

  parameters: {
    [key: string]: ValueTemplate;
  };

  computeNode(parameters: { [key: string]: ValueResult }): NodeResult;
  computeSkeleton?(
    part: SkeletonResult,
    ctx: GeneratorContext,
  ): {
    skeletons?: Float32Array[];
  };
  computeGeometry?(
    part: GeometryResult,
    ctx: GeneratorContext,
  ): {
    skeletons?: Float32Array[];
    geometry?: TransferGeometry;
  };
}

/**
 * Output of a node
 */
interface NodeResult {
  type: string;
  parameters: {
    [key: string]: ValueResult;
  };
}

interface GeneratorContext {
  handleParameter(param: ParameterResult, alpha?: number): number;
  getSetting(key: string): number;
  readonly seed: number;
  refresh(): number;
}

interface ValueTemplate {
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

type ValueResult = NodeResult | ParameterResult | string;

interface Point {
  x: number;
  y: number;
  pinned?: boolean;
}

interface PlantDescription {
  meta: PlantMetaInfo;
  main: NodeResult;
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

interface PlantariumSettings {
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
