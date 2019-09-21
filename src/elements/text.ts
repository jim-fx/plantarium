import "./text.scss";

import UIElement from "./element";

export default class UIText extends UIElement {
  element: HTMLInputElement;
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const text = document.createElement("input");
    this.element = text;
    text.classList.add("ui-text-input");
    text.type = "text";
    text.size = 10;
    text.placeholder = config.title;
    text.addEventListener("click", function() {
      this.select();
    });
    text.addEventListener(
      "change",
      () => {
        this.update(text.value);
      },
      false
    );
    text.addEventListener(
      "keydown",
      function(ev) {
        if (ev.key === "Enter") {
          this.blur();
        }
      },
      false
    );

    if (config.title) {
      const title = document.createElement("h4");
      title.innerHTML = config.title;
      title.classList.add("ui-number-title");
      this.wrapper.append(title);
    }

    if (config.init) {
      const _init = config.init.bind(this);
      this._init = (pd: plantDescription) => {
        const v = _init(pd);
        text.value = v;
        this.update(v);
      };
    }

    this.wrapper.append(text);
  }
}
