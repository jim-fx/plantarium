import "./tab.scss";

import UIElement from "./element";

export default class UITab extends UIElement {
  elements: Map<string, HTMLLIElement> = new Map();

  active: HTMLLIElement | undefined;

  activeID: string | undefined;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    const list = document.createElement("ul");
    list.classList.add("ui-tab-wrapper");

    if (config.title) {
      const title = document.createElement("h4");
      title.innerHTML = config.title;
      title.classList.add("ui-number-title");
      this.wrapper.append(title);
    }

    if (config.init) {
      const _init = config.init.bind(this);
      this._init = (pd: plantDescription) => {
        this.setActive(_init(pd));
      };
    }

    if (config.identifiers) {
      config.identifiers.forEach((id: string) => {
        const listItem = document.createElement("li");
        listItem.style.width = `${100 / config.identifiers.length}%`;

        this.elements.set(id, listItem);

        if (config.default && config.default === id) {
          this.setActive(id);
        }

        listItem.addEventListener(
          "click",
          () => {
            this.setActive(id);
          },
          false
        );

        const p = document.createElement("p");
        p.innerHTML = id;
        listItem.append(p);
        list.append(listItem);
      });
    }

    this.wrapper.append(list);
  }

  setActive(id: string) {
    if (id !== this.activeID) {
      this.activeID = id;
      if (this.active) {
        this.active.classList.remove("ui-tab-active");
      }
      if (this.elements.has(id)) {
        this.active = <HTMLLIElement>this.elements.get(id);
        this.active.classList.add("ui-tab-active");
      }

      this.update(id);
    }
  }
}
