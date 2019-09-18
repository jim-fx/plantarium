interface UIConfig {
  title: string;
  type: string;

  state?: string;
  icon?: string;
  iconOnly?: boolean;
  identifiers?: string[];
  align?: string;
  open?: boolean;
  default?: number | boolean | string;
  max?: number;
  min?: number;
  onClick?: Function;
  onUpdate?: Function;
  children?: UIConfig[];
  init?(obj: any): any;
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
  debug_skeleton: boolean;
  debug_disable_model: boolean;
  debug_grid: boolean;
  debug_grid_size: number;
  debug_grid_resolution: number;
  debug_uv: number;

  ground_enable: boolean;
  ground_resX: number;
  ground_resY: number;
  ground_size: number;
  ground_texture_size: number;

  stemResX: number;
  stemResY: number;
  leafResX: number;
  leafResY: number;
}
