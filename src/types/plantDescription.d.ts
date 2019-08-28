interface parameter {
  value?: number;
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
  amount: parameter;
  diameter: parameter;
  height: parameter;
  noiseScale: number;
}

interface branchDescription {
  diameter: parameter;
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
