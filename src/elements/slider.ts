import "./slider.scss";
import UIElement from "./element";

class UISlider extends UIElement {
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;

    this.wrapper.append(title);

    const slider = document.createElement("input");
    slider.type = "range";

    this.wrapper.append(slider);
  }
}

export default UISlider;
