import "./stage.scss";
import * as elements from "../../elements";
import createFromConfig from "../../elements/createFromConfig";
const topbar = <HTMLElement>document.getElementById("topbar");
const sidebar = <HTMLElement>document.getElementById("sidebar");

export default class Stage implements Stage {
  title: string;
  config: stageConfig;
  wrapper: HTMLDivElement;

  private _plantDescription: plantDescription;
  private _listeners: Function[] = [];
  private button: elements.Button;

  constructor(config: stageConfig, pd: plantDescription) {
    this.title = config.title;
    this.config = config;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("stage-wrapper");
    this._plantDescription = pd;

    this.button = new elements.Button(topbar, this.title);
    this.button.onClick(() => {
      this.show();
    });

    //Create all the elements (sliders, curves...)
    createFromConfig(this);

    sidebar.append(this.wrapper);
  }

  show() {
    this._listeners.forEach(cb => cb());
    this.button.active = true;
    this.wrapper.classList.add("stage-wrapper-visible");
  }

  hide() {
    this.button.active = false;
    this.wrapper.classList.remove("stage-wrapper-visible");
  }

  onActivate(cb: Function) {
    this._listeners.push(cb);
  }

  get plantDescription() {
    return this._plantDescription;
  }

  set plantDescription(v) {
    this._plantDescription = v;
  }
}
