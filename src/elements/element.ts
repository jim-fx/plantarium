import "./element.scss";
export default class UIElement {
  stage: Stage;
  wrapper: HTMLElement;
  config: UIConfig;
  private _enabled: boolean = true;
  private _update: Function;
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    this.stage = stage;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("ui-element-wrapper");
    this.config = config;
    wrapper.append(this.wrapper);

    if (this.config.onUpdate) {
      this._update = v => this.config.onUpdate.bind(this)(v, Object.assign(this.stage.pd, {}), (newState: plantDescription) => (this.stage.pd = newState));
    }
  }

  get enabled() {
    return this._enabled;
  }
  set enabled(v) {
    v ? this.wrapper.classList.remove("ui-element-disabled") : this.wrapper.classList.add("ui-element-disabled");
    this._enabled = v;
  }

  init(_pd: plantDescription) {}

  update(v: parameter) {
    if (this._update) {
      this._update(v);
    }
  }
}
