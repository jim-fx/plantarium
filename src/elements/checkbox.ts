import "./checkbox.scss";
import UIElement from "./element";

export default class UICheckbox extends UIElement {
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const title = document.createElement("h4");
    title.innerHTML = config.title;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "my-check";

    const label = document.createElement("label");
    label.classList.add("checkbox-label");
    label.innerHTML = "✖";
    label.setAttribute("for", "my-check");

    this.wrapper.append(input);
    this.wrapper.append(label);
    this.wrapper.append(title);
  }
}
