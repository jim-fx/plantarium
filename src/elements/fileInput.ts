import "./fileInput.scss";

import UIElement from "./element";

let id = 0;

export default class UIFileInput extends UIElement {
  private element: HTMLInputElement;

  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.element = document.createElement("input");
    this.element.id = "input-file-" + id;
    this.element.type = "file";
    this.element.accept = "application/json";
    this.element.multiple = true;

    this.element.addEventListener("input", () => {
      this.parseFiles(<FileList>this.element.files);
    });

    const label = document.createElement("label");
    label.setAttribute("for", "input-file-" + id++);
    label.innerHTML = config.title || "Upload File";
    label.classList.add("ui-button");

    label.addEventListener("drop", ev => {
      ev.preventDefault();
      this.parseFiles((<DataTransfer>ev.dataTransfer).files);
    });

    label.addEventListener("dragover", ev => {
      ev.preventDefault();
    });

    this.wrapper.append(this.element);
    this.wrapper.append(label);
  }

  parseFiles(files: FileList) {
    if (!files || !files.length) {
      return;
    }

    const fr = new FileReader();

    let i = 0;
    const l = files.length;
    const res: any[] = [];

    fr.onload = e => {
      if (e.target) {
        res.push(JSON.parse(<string>e.target.result));
      }
      if (i < l) {
        fr.readAsText(<File>files.item(i++));
      } else {
        this.update(res);
        this.element.value = "";
      }
    };

    fr.readAsText(<File>files.item(i++));
  }
}
