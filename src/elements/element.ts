import "./element.scss";
export default class UIElement {
  stage: Stage;
  wrapper: HTMLElement;
  config: UIConfig;
  private _enabled: boolean = true;
  private _update: Function | undefined;

  _init: Function | undefined;
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    this.stage = stage;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("ui-element-wrapper");
    this.config = config;
    wrapper.append(this.wrapper);

    if (config.onUpdate) {
      const _update = this.config.onUpdate.bind(this);
      this._update = (v: parameter, original: any = this.stage.pd) => {
        _update(v, original);
        this.stage.pd = this.stage.pd;
      };
    }

    if (config.tooltip) {
      const tooltip = document.createElement("span");
      this.wrapper.classList.add("tooltip");
      tooltip.classList.add("tooltip-text");
      tooltip.innerHTML = config.tooltip;
      this.wrapper.append(tooltip);
    }
  }

  get enabled() {
    return this._enabled;
  }
  set enabled(v) {
    this.wrapper.blur();
    v ? this.wrapper.classList.remove("ui-element-disabled") : this.wrapper.classList.add("ui-element-disabled");
    this._enabled = v;
  }

  init(_pd: plantDescription) {
    if (this._init) this._init(_pd);
  }

  update(v: any, orig?: any) {
    if (this._update) {
      this._update(v, orig);
    }
  }
}
