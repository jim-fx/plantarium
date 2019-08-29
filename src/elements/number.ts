import "./number.scss";
import UIElement from "./element";

export default class UINumber extends UIElement {
  element: HTMLInputElement;

  title: HTMLElement;

  private _value: number = 1;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.title = document.createElement("h4");
    this.title.innerHTML = config.title;
    this.wrapper.append(this.title);

    let buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("ui-number-button-wrapper");

    const subtractButton = document.createElement("button");
    subtractButton.innerHTML = "-";
    subtractButton.addEventListener("click", () => {
      this.value--;
    });
    buttonWrapper.append(subtractButton);

    const addButton = document.createElement("button");
    addButton.innerHTML = "+";
    addButton.addEventListener("click", () => {
      this.value++;
    });
    buttonWrapper.append(addButton);

    this.element = document.createElement("input");
    this.element.type = "number";
    this.element.value = config.default !== undefined ? this.minMax(config.default) : this.minMax(1);
    this._value = parseInt(this.element.value);
    this.element.max = config.max !== undefined ? config.max.toString() : "10";
    this.element.min = config.min !== undefined ? config.min.toString() : "0";
    this.element.addEventListener("input", () => {
      this.value = parseInt(this.element.value);
    });

    buttonWrapper.append(this.element);

    this.wrapper.append(buttonWrapper);
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      const initValue: number = <number>this.config.init.bind(this)(pd);
      if (initValue !== undefined) {
        this._value = initValue;
        this.element.value = initValue;
      }
    }
  }

  get value() {
    return this._value;
  }

  private minMax(v) {
    return Math.max(Math.min(v, this.config.max || 10), this.config.min || 0);
  }

  set value(v) {
    let _v = this.minMax(v);
    if (!isNaN(_v)) {
      this._value = _v;
      this.element.value = _v.toString();
      this.update({
        value: _v
      });
    }
  }
}
