import "./button.scss";

import UIElement from "./element";

export default class UIButton extends UIElement {
  private listeners: Function[];
  private element: HTMLButtonElement;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.element = document.createElement("button");
    this.element.classList.add("button");
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

    this.wrapper.append(this.element);

    this.listeners = [];
  }

  onClick(cb: Function) {
    this.listeners.push(cb);
  }
}
