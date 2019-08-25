import "./slider.scss";
import UIElement from "./element";
import throttle from "../helpers/throttle";

class UISlider extends UIElement {
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;

    this.wrapper.append(title);

    const slider = document.createElement("input");
    if ("default" in config) {
      slider.value = config.default;
    }
    slider.type = "range";

    slider.addEventListener(
      "input",
      throttle(() => {
        this.update({
          value: parseInt(slider.value) / 100
        });
      }, 100),
      false
    );

    this.wrapper.append(slider);
  }
}

export default UISlider;
