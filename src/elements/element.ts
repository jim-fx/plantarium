import "./element.scss";
export default class UIElement {
  stage: Stage;
  wrapper: HTMLElement;
  config: UIConfig;
  _enabled: boolean = true;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    this.stage = stage;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("ui-element-wrapper");
    this.config = config;
    wrapper.append(this.wrapper);
  }

  get enabled() {
    return this._enabled;
  }
  set enabled(v) {
    this._enabled = v;
  }

  update(v: parameter) {
    if (this.config.onUpdate) {
      this.config.onUpdate(
        v,
        Object.assign(this.stage.pd, {}),
        (newState: plantDescription) => (this.stage.pd = newState)
      );
    }
  }
}
