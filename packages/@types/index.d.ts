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
  value: number;
  variation?: number;
  curve?: Vec2[];
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
  handleParameter(param: ParameterResult | number = 0, alpha?: number): number;
  getSetting(key: string, defaultValue?: number): number;
  readonly settings: PlantariumSettings;
  readonly seed: number;
  refresh(): void;
}

type SettingsTemplate = {
  [key: string]: ValueTemplate | { options: SettingsTemplate };
};

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
  steps?: number;
  defaultValue?: number | string | boolean | Vec3;
}

type ValueResult = NodeResult | ParameterResult | string;

interface Vec2 {
  x: number;
  y: number;
  pinned?: boolean;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
  pinned?: boolean;
}

interface NodeProps {
  attributes: NodeAttributes;
  state?: any;
}

interface PlantProject {
  meta: PlantProjectMeta;
  nodes: NodeProps[];
}

interface PlantProjectMeta {
  name: string;

  id: string;

  authorID?: string;

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

interface GeometryResult extends NodeResult {
  result: {
    skeletons?: Float32Array[];
    geometry?: TransferGeometry;
    debugVectors?: Float32Array[];
    debugNormals?: Float32Array[];
  };
  parameters: {
    [key: string]: ParameterResult;
    input?: GeometryResult;
    type?: string;
    origin?: Vec3;
  };
}

interface PlantNode {
  title: string;
  type: string;

  outputs: string[];

  parameters: {
    [key: string]: ValueTemplate;
  };

  computeNode?(parameters: { [key: string]: ValueResult }): NodeResult;
  computeSkeleton?(part: GeometryResult, ctx: GeneratorContext);
  computeGeometry?(part: GeometryResult, ctx: GeneratorContext);
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
