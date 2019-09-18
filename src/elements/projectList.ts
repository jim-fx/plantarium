import "./projectList.scss";
import icon from "../assets/icons";
import UIElement from "./element";
import projectManager from "../components/project-manager";
import makeEditable from "../helpers/makeEditable";

const deleteWrapper = document.createElement("div");
deleteWrapper.classList.add("ui-delete-wrapper");
const deleteWrapperCancel = document.createElement("button");
deleteWrapperCancel.innerHTML = "cancel";
deleteWrapperCancel.classList.add("ui-delete-cancel");
const deleteWrapperConfirm = document.createElement("button");
deleteWrapperConfirm.innerHTML = "confirm";
deleteWrapperConfirm.classList.add("ui-delete-confirm");
deleteWrapper.append(deleteWrapperConfirm);
deleteWrapper.append(deleteWrapperCancel);

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
        projectManager.newPlant();
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
        this.deletePlant(_meta);
      },
      false
    );
    deleteButton.append(icon.cross);
    buttons.append(deleteButton);
    tr.append(buttons);

    tr.addEventListener("click", () => projectManager.setActivePlant(_meta), false);

    if (_meta.name === _active) {
      tr.classList.add("ui-project-list-row-active");
    }

    this.rows.set(_meta.name, tr);
    this.table.insertBefore(tr, this.table.firstChild);
    this.scrollTop();
  }

  deletePlant(_meta: plantMetaInfo) {
    const rowToBeDeleted = <HTMLTableRowElement>this.rows.get(_meta.name);

    (<HTMLElement>rowToBeDeleted.parentNode).insertBefore(deleteWrapper, rowToBeDeleted);

    deleteWrapperCancel.onclick = () => {
      deleteWrapper.remove();
    };

    deleteWrapperConfirm.onclick = () => {
      rowToBeDeleted.classList.add("ui-row-deleted");
      setTimeout(() => {
        rowToBeDeleted.remove();
      }, 500);
      projectManager.deletePlant(_meta);
      this.rows.delete(_meta.name);
      deleteWrapper.remove();
    };
  }

  init() {
    const newMetas = projectManager.plantMetas;
    const newNames = newMetas.map(_meta => _meta.name);

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
    newMetas.forEach((_meta: plantMetaInfo) => {
      const el = this.rows.get(_meta.name);
      if (el) {
        //If name already has a row activate that row
        _meta.name === _active ? el.classList.add("ui-project-list-row-active") : el.classList.remove("ui-project-list-row-active");
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
