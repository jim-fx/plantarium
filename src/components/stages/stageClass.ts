import "./stage.scss";
import createFromConfig from "../../elements/createFromConfig";
const sidebar = <HTMLElement>document.getElementById("sidebar");

export default class Stage implements Stage {
  title: string;
  config: stageConfig;
  wrapper: HTMLDivElement;

  private _listeners: Function[] = [];
  private _nextStage: Stage | undefined;
  private _pd: plantDescription | undefined;

  constructor(config: stageConfig) {
    this.title = config.title;
    this.config = config;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("stage-wrapper");

    //Create all the elements (sliders, curves...)
    createFromConfig(this);

    sidebar.append(this.wrapper);
  }

  show() {
    this.wrapper.classList.add("stage-wrapper-visible");
  }

  hide() {
    this.wrapper.classList.remove("stage-wrapper-visible");
  }

  connect(stage: Stage) {
    this._nextStage = stage;
  }

  onActivate(cb: Function) {
    this._listeners.push(cb);
  }

  get pd() {
    return this._pd;
  }

  set pd(v) {
    this._pd = v;
    if (this._nextStage) {
      this._nextStage.pd = this._pd;
    }
  }
}
