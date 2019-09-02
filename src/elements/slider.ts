import "./slider.scss";
import UIElement from "./element";
import throttle from "../helpers/throttle";
import logger from "../logger";

const log = logger("ui-slider");

class UISlider extends UIElement {
  element: HTMLInputElement;
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;
    this.wrapper.append(title);

    this.element = document.createElement("input");
    this.element.type = "range";

    const min = "min" in config ? config.min * 1000 : 0;
    this.element.min = min.toString();

    const max = "max" in config ? config.max * 1000 : 1000;
    this.element.max = max.toString();

    this.element.step = Math.abs((max - max) / 100).toString();

    if (config.default !== undefined) this.element.value = "" + config.default * 1000;

    if (config.init) {
      const _init = config.init.bind(this);
      this._init = (pd: plantDescription) => {
        const initValue: number = <number>_init(pd);
        if (initValue !== undefined) {
          log("init " + this.config.title + " with value: " + initValue, 3);
          this.element.value = (initValue * 1000).toString();
        }
      };
    }

    this.element.addEventListener(
      "input",
      throttle(() => {
        this.update({
          value: parseInt(this.element.value) / 1000
        });
      }, 20),
      false
    );

    this.wrapper.append(this.element);
  }
}

export default UISlider;
