import UIElement from "./element";
import "./projectMeta.scss";

export default class UIProjectMeta extends UIElement {
  rows: Map<string, HTMLInputElement> = new Map();

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.wrapper.classList.add("ui-project-meta-wrapper");

    const table = document.createElement("table");

    if (config.identifiers) {
      config.identifiers.forEach(id => {
        const tr = document.createElement("tr");

        const tdI = document.createElement("td");
        tdI.innerHTML = id;
        const tdV = document.createElement("td");
        const text = document.createElement("input");
        text.type = "text";
        text.size = 10;
        text.addEventListener("click", function() {
          this.select();
        });
        text.addEventListener(
          "change",
          () => {
            if (text.value.length === 0 || text.value === "?") text.value = "?";
            else text.value = text.value.replace("?", "");
            this.update(this.object);
          },
          false
        );
        tdV.append(text);
        this.rows.set(id, text);

        tr.append(tdI);
        tr.append(tdV);

        table.append(tr);
      });
    }

    this.wrapper.append(table);
  }

  get object() {
    return Array.from(this.rows).reduce((obj, [key, element]) => {
      if (element.value !== "?") {
        return Object.assign(obj, { [key]: element.value });
      } else {
        return obj;
      }
    }, {});
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      const initValue: object = this.config.init(pd);

      this.rows.forEach((p, k) => {
        if (k in initValue) {
          //@ts-ignore
          p.value = initValue[k];
        } else {
          p.value = "?";
        }
      });
    }
  }
}
