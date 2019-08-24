interface stageConfig {
  title: string;
  children: UIConfig[];
}

interface Vector {
  x: number;
  y: number;
}

interface curveOutput {
  points: Vector[];
}

interface parameter {
  value: number;
  min?: number;
  max?: number;
  curve?: curveOutput;
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
  plantDescription: plantDescription;
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
  onUpdate?: Function;
  children?: UIConfig[];
}

interface Button {
  wrapper: HTMLElement;
  active: boolean;
  onClick(cb: Function): void;
}
