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
  value: number | Vec2[];
  variation?: number;
  curve?: Vec2[];
}

interface Vec2 {
  x: number;
  y: number;
  pinned?: boolean;
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
  step?: number;
  defaultValue?: number | string | boolean | Vec3;
}

type ValueResult = NodeResult | ParameterResult | string;

interface Vector2 {
  x: number;
  y: number;
  pinned?: boolean;
}

interface Vector3 {
  x: number;
  y: number;
  z: number;
  pinned?: boolean;
}

interface NodeProps {
  attributes: NodeAttributes;
  state?: Record<string, unknown>;
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
    inputA?: GeometryResult;
    inputB?: GeometryResult;
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

  compute?(parameters: { [key: string]: ValueResult }): NodeResult;
  computeNode?(parameters: { [key: string]: ValueResult }): NodeResult;
  computeSkeleton?(part: GeometryResult, ctx: GeneratorContext);
  computeGeometry?(part: GeometryResult, ctx: GeneratorContext);
}

interface PlantariumSettings {
  seed: number;
  useRandomSeed: boolean;

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

  debug: {
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

  ground: {
    enabled: boolean;
    resX: number;
    resY: number;
    scale: number;
    textureSize: number;
  };

  export: {
    filetype: string;
  };
}
