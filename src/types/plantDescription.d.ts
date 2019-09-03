interface parameter {
  value: number;
  type?: "float" | "int";
  enabled?: boolean;
  variation?: number;
  shape?: point[];
  curve?: point[];
}

interface plantMetaInfo {
  name: string;
  seed?: number;
  randomSeed?: boolean;
  lastSaved?: number;
  author?: string;
  latinName?: string;
  family?: string;
  class?: string;
}

interface stemDescription {
  amount: number;
  diameter: parameter;
  size: parameter;
  gravity: number;

  originOffset: parameter;
  originAngle: parameter;
  originRotation: parameter;

  noiseStrength: parameter;
  noiseScale: number;
}

interface branchDescription {
  enable: boolean;
  amount: number;
  lowestBranch: parameter;
  length: parameter;
  angle: parameter;
  rotation: parameter;
  diameter: parameter;
  offset: parameter;
  gravity: number;
  noiseScale: number;
  noiseStrength: parameter;
}

interface leafDescription {
  enable: boolean;

  amount: number;
  gravity: number;

  lowestLeaf: number;

  onStem: boolean;
  onBranches: boolean;

  angle: parameter;
  rotation: parameter;

  offset: parameter;

  size: parameter;
  shape: point[];

  xCurvature: parameter;
  yCurvature: parameter;
}

interface plantDescription {
  meta: plantMetaInfo;
  stem: stemDescription;
  branches: branchDescription;
  leaves: leafDescription;
}
