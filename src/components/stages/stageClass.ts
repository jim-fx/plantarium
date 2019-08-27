import "./stage.scss";
import createFromConfig from "../../elements/createFromConfig";
import StageHandler from "./stageHandler";
import UIElement from "../../elements/element";

const sidebar = <HTMLElement>document.getElementById("sidebar");

export default class Stage implements Stage {
  title: string;
  config: stageConfig;
  wrapper: HTMLDivElement;

  private _listeners: Function[] = [];
  private _nextStage: Stage | undefined;
  private _pd: plantDescription | undefined;
  private _elements: UIElement[] = [];

  constructor(config: stageConfig) {
    this.title = config.title;
    this.config = config;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("stage-wrapper");

    //Create all the elements (sliders, curves...)
    this._elements.push(...createFromConfig(this));

    sidebar.append(this.wrapper);
    StageHandler.registerStage(this);
  }

  show() {
    this.wrapper.classList.add("stage-wrapper-visible");
  }

  hide() {
    this.wrapper.classList.remove("stage-wrapper-visible");
  }

  init(pd: plantDescription) {
    this._pd = pd;

    this._elements.forEach(el => el.init(pd));

    if (this._nextStage) {
      this._nextStage.init(pd);
    }
  }

  connect(stage: Stage | any) {
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
