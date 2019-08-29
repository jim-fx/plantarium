interface UIConfig {
  title: string;
  type: string;
  identifiers?: string[];
  open?: boolean;
  default?: number | boolean;
  max?: number;
  min?: number;
  onClick?: Function;
  onUpdate?: Function;
  children?: UIConfig[];
  init?(pd: plantDescription): any;
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
  config: UIConfig;
  show(): void;
  init(pd: plantDescription): void;
  hide(): void;
  onActivate(cb: Function): void;
}

interface settings {
  useRandomSeed: boolean;
  seed: number;

  forceUpdate: boolean;

  debug_wireframe: boolean;
  debug_indices: boolean;
  debug_render_perf: boolean;
  debug_generate_perf: boolean;
  debug_pd: boolean;

  stemResX: number;
  stemResY: number;
}