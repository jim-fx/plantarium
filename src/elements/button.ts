import "./button.scss";

import UIElement from "./element";

export default class UIButton extends UIElement {
  private listeners: Function[];
  private element: HTMLButtonElement;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.element = document.createElement("button");
    this.element.classList.add("ui-button");
    this.element.innerHTML = config.title;
    this.element.addEventListener(
      "click",
      () => {
        if (config.onClick) {
          config.onClick();
        }
      },
      false
    );

    if (config.state) {
      this.element.classList.add("ui-button-" + config.state);
    }

    this.wrapper.append(this.element);

    this.listeners = [];
  }

  onClick(cb: Function) {
    this.listeners.push(cb);
  }
}
