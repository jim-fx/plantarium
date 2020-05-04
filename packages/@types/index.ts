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

interface Parameter {
  value: number;
  type?: 'float' | 'int';
  enabled?: boolean;
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

interface StemDescription {
  amount: number;
  diameter: Parameter;
  size: Parameter;
  gravity: number;

  originOffset: Parameter;
  originAngle: Parameter;
  originRotation: Parameter;

  noiseStrength: Parameter;
  noiseScale?: number;
}

interface BranchDescription {
  enable: boolean;
  amount: number;
  lowestBranch: Parameter;
  length: Parameter;
  angle: Parameter;
  rotation: Parameter;
  diameter: Parameter;
  offset: Parameter;
  gravity: number;
  noiseScale: number;
  noiseStrength: Parameter;
}

interface LeafDescription {
  enable: boolean;

  amount: number;
  gravity: number;

  lowestLeaf?: number;

  onStem: boolean;
  onBranches: boolean;

  angle: Parameter;
  rotation: Parameter;

  offset: Parameter;

  size: Parameter;
  shape: Point[];

  xCurvature: Parameter;
  yCurvature: Parameter;
}

export interface PlantDescription {
  meta: PlantMetaInfo;
  stem: StemDescription;
  branches: BranchDescription;
  leaves: LeafDescription;
}

export interface PlantariumSettings {
  useRandomSeed: boolean;
  seed: number;

  forceUpdate: boolean;

  debug_wireframe: boolean;
  debug_indices: boolean;
  debug_render_perf: boolean;
  debug_generate_perf: boolean;
  debug_pd: boolean;
  debug_skeleton: boolean;
  debug_disable_model: boolean;
  debug_grid: boolean;
  debug_grid_size: number;
  debug_grid_resolution: number;
  debug_uv: number;

  ground: {
    enable: boolean;
    resX: number;
    resY: number;
    scale: number;
    texture_size: number;
  };

  exp_useRandomSeed: boolean;
  exp_filetype: string;
  exp_seed: string;

  stemResX: number;
  stemResY: number;
  leafResX: number;
  leafResY: number;
}

export interface Point {
  x: number;
  y: number;
  locked?: boolean;
}

import './ogl';
