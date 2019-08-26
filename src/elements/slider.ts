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
    if (config.default !== undefined) this.element.value = "" + config.default * 100;

    this.element.addEventListener(
      "input",
      throttle(() => {
        this.update({
          value: parseInt(this.element.value) / 100
        });
      }, 100),
      false
    );

    this.wrapper.append(this.element);
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      const initValue: number = <number>this.config.init(pd);

      if (initValue !== undefined) {
        log("init " + this.config.title + " with value: " + initValue, 3);
        this.element.value = (initValue * 100).toString();
      }
    }
  }
}

export default UISlider;
