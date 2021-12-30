/**
 * Result of a node which returns geometry
 */
interface TransferGeometry {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  index: Uint16Array | Uint32Array;
  skeleton?: Float32Array[];
  instances?: InstancedGeometry[];
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

/**
 * Output of a node
 */
interface NodeResult {
  type: string;
  parameters: {
    [key: string]: ValueResult;
  };
}
/**
 * Output of a node which produces geometry
 */
interface GeometryResult extends NodeResult {
  skeletons?: Float32Array[];
  allSkeletons: Float32Array[];
  geometry?: TransferGeometry;
  instances: InstancedGeometry[];
  debugVectors?: Float32Array[];
  debugNormals?: Float32Array[];
}

interface GeneratorContext {
  handleParameter(param: unknown, alpha?: number);
  getSetting(key: keyof PlantariumSettings, defaultValue?: number): number;
  n1d(scale: number): number;
  readonly settings: Partial<PlantariumSettings>;
  readonly seed: number;
  refresh(): void;
}

type SettingsTemplate = {
  onlyDev?: boolean;
  [key: string]:
    | ValueTemplate
    | { onlyDev?: boolean; options: SettingsTemplate };
};

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

type ValueResult = NodeResult | ParameterResult | string;

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

interface ParameterResult {
  value: number | Vec2[];
  variation?: number;
  curve?: Vec2[];
}

type Parameter = ParameterResult | GeometryResult | Vec3 | number | Vec2;

interface PlantNode {
  title: string;
  type: string;

  outputs: string[];

  parameters: {
    [key: string]: ValueTemplate;
  };

  compute?(parameters: { [key: string]: ValueResult }): NodeResult;
  computeNode?(parameters: { [key: string]: ValueResult }): NodeResult;
  computeSkeleton?(parameters: Record<string, any>, ctx: GeneratorContext);
  computeGeometry?(
    parameters: Record<string, any>,
    result: GeometryResult,
    ctx: GeneratorContext,
  );
  computeValue?: (
    parameters: Record<string, any>,
    ctx: GeneratorContext,
    a?: number,
  ) => number;
}

interface GeneratorContextNode {
  type: string;
  parameters: {
    [key: string]: ValueTemplate;
  };
  computedParameters: Record<string, Parameter | GeneratorContextNode>;
  result: GeometryResult;
}

interface PlantariumSettings {
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
