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
  curve?: point[];
}

interface stemDescription {
  diameter: parameter;
  height: parameter;
}

interface branchDescription {
  diameter: parameter;
}

interface leafDescription {
  diameter: parameter;
}

interface plantDescription {
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
  hide(): void;
  onActivate(cb: Function): void;
}

interface UIConfig {
  title: string;
  type: string;
  default: number;
  onUpdate?: Function;
  children?: UIConfig[];
}

interface Button {
  wrapper: HTMLElement;
  onClick(cb: Function): void;
}
