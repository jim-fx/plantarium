import "./checkbox.scss";
import UIElement from "./element";

let id = 0;

export default class UICheckbox extends UIElement {
  private element: HTMLInputElement;
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;

    this.config = config;

    let _id = "checkbox-id-" + id++;

    this.element = document.createElement("input");
    this.element.setAttribute("data-t", config.title);
    this.element.type = "checkbox";
    this.element.id = _id;
    this.element.addEventListener(
      "click",
      () => {
        this.update({
          enabled: this.element.checked
        });
      },
      false
    );

    const label = document.createElement("label");
    label.classList.add("checkbox-label");
    label.innerHTML = "✖";
    label.setAttribute("for", _id);

    if (config.default === true) {
      this.element.checked = true;
    }

    this.wrapper.append(this.element);
    this.wrapper.append(label);
    this.wrapper.append(title);
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      this.element.checked = this.config.init.bind(this)(pd);
    }
  }
}
