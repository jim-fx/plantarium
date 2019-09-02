import "./element.scss";
import { parameter } from "../components/model-generator/helper";
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
      const _update = this.config.onUpdate.bind(this);
      this._update = (v: parameter) => {
        _update(v, this.stage.pd);
        this.stage.pd = this.stage.pd;
      };
    }
  }

  get enabled() {
    return this._enabled;
  }
  set enabled(v) {
    v ? this.wrapper.classList.remove("ui-element-disabled") : this.wrapper.classList.add("ui-element-disabled");
    this._enabled = v;
  }

  init(_pd: plantDescription) {
    if (this._init) this._init(_pd);
  }

  update(v: parameter) {
    if (this._update) {
      this._update(v);
    }
  }
}
