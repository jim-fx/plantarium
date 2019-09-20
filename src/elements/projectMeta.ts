import UIElement from "./element";
import "./projectMeta.scss";
import icon from "../assets/icons";

let id = 0;

export default class UIProjectMeta extends UIElement {
  object: any = {};
  orig: any = {};

  rows: Map<string, HTMLTableRowElement> = new Map();

  identifiers: string[] | undefined;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.wrapper.classList.add("ui-project-meta-wrapper");

    const table = document.createElement("table");

    if (config.title) {
      const title = document.createElement("h3");
      title.style.marginBottom = "15px";
      title.innerHTML = config.title;
      this.wrapper.append(title);
    }

    this.identifiers = config.identifiers;

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

            this.object[id] = text.value;
            this.update(this.object, this.orig);
            this.orig = JSON.parse(JSON.stringify(this.object));
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
        tdV.append(text);
        this.rows.set(id, text);

        tr.append(tdI);
        tr.append(tdV);

        table.append(tr);
      });
    }

    {
      const _id = "ui-project-meta-" + id++;
      const publicCheck = document.createElement("input");
      publicCheck.type = "checkbox";
      publicCheck.id = _id;
      publicCheck.addEventListener(
        "click",
        () => {
          this.object["public"] = publicCheck.checked;
          this.update(this.object, this.orig);
          this.orig = JSON.parse(JSON.stringify(this.object));
        },
        false
      );

      const label = document.createElement("label");
      label.classList.add("checkbox-label");
      label.append(icon.cross);
      label.setAttribute("for", _id);

      const tr = document.createElement("tr");

      const p = document.createElement("td");
      p.innerHTML = "public";

      tr.append(p);

      const c = document.createElement("td");
      c.append(publicCheck);
      c.append(label);
      tr.append(c);

      table.append(tr);
    }

    this.wrapper.append(table);
  }

  init(pd: plantDescription) {
    if (this.config.init) {
      const initValue: object = this.config.init(pd);

      this.object = initValue;
      this.orig = JSON.parse(JSON.stringify(initValue));

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
