import "./projectList.scss";
import icon from "../assets/icons";
import UIElement from "./element";
import projectManager from "../components/project-manager";
import makeEditable from "../helpers/makeEditable";

export default class UIPlantList extends UIElement {
  rows: Map<string, HTMLTableRowElement> = new Map();
  table: HTMLTableElement = document.createElement("table");
  scrollWrapper: HTMLDivElement = document.createElement("div");
  constructor(stage: Stage, wrapper: HTMLElement, config: UIConfig) {
    super(stage, wrapper, config);

    this.wrapper.classList.add("ui-project-list-wrapper");

    this.scrollWrapper.classList.add("ui-project-list-scroll-wrapper");

    const addNewButton = document.createElement("button");
    addNewButton.addEventListener(
      "click",
      () => {
        projectManager.addPlant();
      },
      false
    );
    addNewButton.innerHTML = "+";

    this.scrollWrapper.append(this.table);
    this.wrapper.append(this.scrollWrapper);
    this.wrapper.append(addNewButton);
  }

  addPlant(_meta: plantMetaInfo) {
    const _active = projectManager.activePlantName;

    const tr = document.createElement("tr");

    //Create projectName
    const projectName = document.createElement("td");
    const p = document.createElement("p");
    p.innerHTML = _meta.name;
    projectName.addEventListener("dblclick", () =>
      makeEditable(p, (value: string) => {
        const newMeta = JSON.parse(JSON.stringify(_meta));
        newMeta.name = value;
        p.innerHTML = value;
        projectManager.updateMeta(_meta, newMeta);
      })
    );
    projectName.append(p);
    tr.append(projectName);

    //Create the buttons
    const buttons = document.createElement("td");
    buttons.align = "right";
    const downloadJSONButton = document.createElement("button");
    downloadJSONButton.addEventListener(
      "click",
      () => {
        projectManager.download(_meta);
      },
      false
    );
    downloadJSONButton.append(icon.arrow);
    buttons.append(downloadJSONButton);

    //Create the delete Button
    const deleteButton = document.createElement("button");
    deleteButton.addEventListener(
      "click",
      ev => {
        ev.preventDefault();
        ev.stopPropagation();

        const rowToBeDeleted = <HTMLTableRowElement>this.rows.get(_meta.name);
        rowToBeDeleted.classList.add("ui-row-deleted");
        this.rows.delete(_meta.name);

        setTimeout(() => {
          rowToBeDeleted.remove();
        }, 500);
        projectManager.deletePlant(_meta);
      },
      false
    );
    deleteButton.append(icon.cross);
    buttons.append(deleteButton);
    tr.append(buttons);

    tr.addEventListener(
      "click",
      () => projectManager.setActivePlant(_meta),
      false
    );

    if (_meta.name === _active) {
      tr.classList.add("ui-project-list-row-active");
    }

    this.rows.set(_meta.name, tr);
    this.table.insertBefore(tr, this.table.firstChild);
    this.scrollTop();
  }

  init() {
    const newNames = projectManager.plantNames;

    //Remove rows if they are not present in the new data
    Array.from(this.rows.keys()).forEach(k => {
      if (!newNames.includes(k)) {
        const el = <HTMLTableRowElement>this.rows.get(k);
        this.rows.delete(k);
        el.remove();
      }
    });

    //Create all rows that arent created yet
    const _active = projectManager.activePlantName;
    projectManager.plantMetas.forEach((_meta: plantMetaInfo) => {
      const el = this.rows.get(_meta.name);
      if (el) {
        //If name already has a row activate that row
        _meta.name === _active
          ? el.classList.add("ui-project-list-row-active")
          : el.classList.remove("ui-project-list-row-active");
      } else {
        this.addPlant(_meta);
      }
    });
  }

  scrollTop() {
    const _scrollTop = this.scrollWrapper.scrollTop;
    let i = 0;
    const l = 30;
    let a = 0;

    const render = () => {
      i++;
      if (i <= l) {
        requestAnimationFrame(render);
        a = 1 - i / l;
        this.scrollWrapper.scrollTop = a * (2 - a) * _scrollTop;
      }
    };

    render();
  }
}
