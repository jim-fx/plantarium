interface stageConfig {
  title: string;
  children: UIConfig[];
}

interface Vector {
  x: number;
  y: number;
}

interface parameter {
  value?: number;
  variation?: number;
  shape?: point[];
  curve?: point[];
}

interface plantMetaInfo {
  name: string;
  author?: string;
  latinName?: string;
  family?: string;
  class?: string;
}

interface stemDescription {
  amount: parameter;
  diameter: parameter;
  height: parameter;
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

interface point {
  x: number;
  y: number;
  locked?: boolean;
}

interface Stage {
  pd: plantDescription | undefined;
  title: string;
  wrapper: HTMLDivElement;
  config: stageConfig;
  show(): void;
  init(pd: plantDescription): void;
  hide(): void;
  onActivate(cb: Function): void;
}

interface UIConfig {
  title: string;
  type: string;
  identifiers: string[];
  default?: number;
  max?: number;
  min?: number;
  onClick?: Function;
  onUpdate?: Function;
  children?: UIConfig[];
  init(pd: plantDescription): number | string | point[];
}
