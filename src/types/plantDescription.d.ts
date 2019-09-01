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
  amount: number;

  lowestBranch: parameter;

  length: parameter;

  angle: parameter;

  diameter: parameter;
  offset: parameter;

  gravity: number;
}

interface leafDescription {
  diameter: parameter;
  size: parameter;
  shape: point[];
}

interface plantDescription {
  meta: plantMetaInfo;
  stem: stemDescription;
  branches: branchDescription;
  leaves: leafDescription;
}
