import "./checkbox.scss";
import icon from "../assets/icons";
import UIElement from "./element";

let id = 0;

export default class UICheckbox extends UIElement {
  private element: HTMLInputElement;

  private _init: Function;
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;

    this.config = config;

    if (config.init) {
      const _init = config.init.bind(this);
      this._init = (pd: plantDescription) => {
        const initValue = _init(pd);
        if (typeof initValue === "boolean") {
          this.element.checked = initValue;
        }
      };
    }

    let _id = "checkbox-id-" + id++;

    this.element = document.createElement("input");
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
    label.append(icon.cross)
    label.setAttribute("for", _id);

    this.wrapper.append(this.element);
    this.wrapper.append(label);
    this.wrapper.append(title);

    if (config.default) {
      this.element.checked = true;
    }
  }
}
