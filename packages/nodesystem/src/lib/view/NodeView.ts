import type Node from '../model/Node';
import { Icon } from "@plantarium/ui"
import type System from '../model/NodeSystem';
import type { CustomMouseEvent } from '../types';
import type NodeConnectionView from './NodeConnectionView';
import type InputView from './NodeInputView';
import type OutputView from './NodeOutputView';
import './NodeView.scss';

export default class NodeView {
  node: Node;
  wrapper: HTMLDivElement;
  outputWrapper: HTMLDivElement;
  helpWrapper: HTMLDivElement;
  icon: Icon;
  iconWrapper: HTMLDivElement;
  stateWrapper: HTMLDivElement;

  inputs: InputView[] = [];
  outputs: OutputView[] = [];

  active = false;
  x = 0;
  y = 0;

  downX = 0;
  downY = 0;

  mDownX = 0;
  mDownY = 0;

  height = 50;
  width = 91;
  _state: string | undefined;
  system: System;

  hoveredConnection: NodeConnectionView;

  title!: HTMLElement;

  _unsubscribeMouseMove!: () => void;
  _unsubscribeMouseUp!: () => void;
  errorWrapper: HTMLDivElement;

  constructor(node: Node) {
    this.node = node;

    this.system = node.system;

    this.wrapper = document.createElement('div');

    // Check if we have any states that can be hidden
    if (Object.values(this.node.states).find(s => "hidden" in s.template)) {
      this.iconWrapper = document.createElement("div");
      this.icon = new Icon({ target: this.iconWrapper, props: { name: "cog" } });
      this.wrapper.appendChild(this.iconWrapper)
    }



    this.wrapper.style.minHeight = this.height + 'px';
    this.wrapper.style.minWidth = this.width + 'px';
    this.wrapper.classList.add(
      'node-wrapper',
      'node-type-' + node.attributes.type.toLowerCase(),
    );
    this.wrapper.setAttribute(
      'id',
      'node-view-' + this.system.id + '-' + this.node.id,
    );

    this.errorWrapper = document.createElement("div");
    this.errorWrapper.classList.add("nodeview-error-wrapper");
    this.wrapper.appendChild(this.errorWrapper)

    this.outputWrapper = document.createElement('div');
    this.outputWrapper.classList.add('node-outputs-wrapper');
    this.wrapper.append(this.outputWrapper);

    const title = document.createElement('p');
    title.innerHTML = node.attributes.name || node.attributes.type;
    title.classList.add('node-title');
    this.wrapper.appendChild(title);

    this.stateWrapper = document.createElement('div');
    this.stateWrapper.classList.add('node-state-wrapper');
    this.wrapper.append(this.stateWrapper);

    node.system.view.nodeContainer.append(this.wrapper);

    const { pos: { x = 0, y = 0 } = {} } = node.attributes;
    this.x = x;
    this.y = y;


    this.wrapper.style.left = x + 'px';
    this.wrapper.style.top = y + 'px';

    if (this.node?.meta?.description) {
      this.helpWrapper = document.createElement("div");
      this.helpWrapper.innerHTML = `<h3>${node.attributes.name || node.attributes.type}</h3>
<p>${this.node.meta.description}</p>`
      this.helpWrapper.classList.add("nodeview-help-wrapper");
      this.wrapper.append(this.helpWrapper)

    }

    setTimeout(() => {
      const { width, height } = this.wrapper.getBoundingClientRect();
      this.width = width / this.system.view.s;
      this.height = height / this.system.view.s;
      this.updateViewPosition();
    }, 10);

    this.bindEventListeners();
  }

  bindEventListeners() {

    if (this.helpWrapper) {
      this.system.view.on("transform", () => {
        const { x } = this.wrapper.getBoundingClientRect()
        if (x > this.system.view.width / 2) {
          this.wrapper.classList.remove("tooltip-right");
          this.wrapper.classList.add("tooltip-left");
        } else {
          this.wrapper.classList.add("tooltip-right");
          this.wrapper.classList.remove("tooltip-left");
        }
      }, 2000);
    }

    this.iconWrapper?.addEventListener("click", () => {
      if (this.state === "stateselect") {
        this.state = ""
      } else {
        this.state = "stateselect"
      }
    })

    this.wrapper.addEventListener('mousedown', (ev) =>
      this.handleMouseDown(ev),
    );
    this._unsubscribeMouseMove = this.system.view.on(
      'mousemove',
      (ev: CustomMouseEvent) => this.handleMouseMove(ev),
    );
    this._unsubscribeMouseUp = this.system.view.on('mouseup', () =>
      this.handleMouseUp(),
    );
  }

  removeEventListeners() {
    this._unsubscribeMouseMove();

    this._unsubscribeMouseUp();
    this.wrapper.addEventListener('mousedown', (ev) =>
      this.handleMouseDown(ev),
    );
  }

  set state(s: string | undefined) {

    if (s === "stateselect" || (this.state === "stateselect" && s !== "stateselect")) {
      setTimeout(() => {
        Object.values(this.node.states).forEach(s => s?.view?.updatePosition())
      }, 10)
    }

    if (this._state === "stateselect" && s !== this._state) {
      // Here we remove all connections which are connected to hidden sockets.
      for (const s of Object.values(this.node.states)) {
        if (s.view.hideable && !s.view.visible) {
          s.getInput()?.connection?.remove()
        }
      }
    }

    this.wrapper.classList.remove(
      'node-active',
      'node-selected',
      'node-dragging',
      "node-stateselect"
    );
    if (s === "no-error") {
      this.wrapper.classList.remove("node-error")
    }
    this.wrapper.classList.add('node-' + (s || "normal"));
    this._state = s;
  }

  get state() {
    return this._state;
  }

  showErrors(_errors?: string[] | string) {
    this.errorWrapper.innerHTML = ""
    this.errorWrapper.classList.remove("has-errors");
    if (!_errors) return;
    const errors = Array.isArray(_errors) ? _errors : [_errors];
    if (errors?.length) {
      this.errorWrapper.classList.add("has-errors");
      this.errorWrapper.innerHTML = errors.map(err => `<div class="nodeview-error">${err}</div>`).join("")
    }
  }

  handleMouseDown(ev: MouseEvent) {
    if (this.system.view.keyMap.space || ev.button === 2) return;
    if (ev.target !== ev.currentTarget) return;
    ev.stopImmediatePropagation();
    ev.stopPropagation();

    this.node.system.view.setActive(this.node, ev);

    const { rmx: x, rmy: y } = this.system.view;

    this.mDownX = x;
    this.mDownY = y;

    this.downX = this.node.attributes?.pos?.x || 0;
    this.downY = this.node.attributes?.pos?.y || 0;

    this.active = true;

    // Set mouse down for all selected nodes, this makes it possible to move multiple nodes at the same time
    if (this.system.view.selectedNodes.length) {
      this.system.view.selectedNodes.forEach((node) => {
        node.view.active = true;
        node.view.mDownX = x;
        node.view.mDownY = y;

        node.view.downX = node.view.x;
        node.view.downY = node.view.y;
      });
    }

  }

  handleMouseUp() {
    this.active = false;

    if (this.hoveredConnection) {
      this.hoveredConnection.connection.joinNode(this.node);
      delete this.hoveredConnection;
    }
  }

  showUpdate() {
    this.wrapper.classList.add('is-updating');
    setTimeout(() => {
      this.wrapper.classList.remove('is-updating');
    }, 200);
  }

  handleMouseMove({ mx: _x, my: _y, keys }) {
    if (this.active) {
      this.state = 'dragging';
      const precision = keys.ctrlKey ? 0.02 : 1;

      let vx = this.mDownX - _x;
      let vy = this.mDownY - _y;

      if (keys.shiftKey) {
        if (Math.abs(vx) > Math.abs(vy)) {
          vy = 0;
        } else {
          vx = 0;
        }
      }

      const x =
        Math.round((this.downX - vx / this.system.view.s) * precision) /
        precision;
      const y =
        Math.round((this.downY - vy / this.system.view.s) * precision) /
        precision;

      this.setPosition(x, y);
    }
  }

  updateViewPosition() {

    if (this.node.attributes.pos.x !== this.x || this.node.attributes.pos.y !== this.y) {
      this.x = this.node.attributes.pos.x;
      this.y = this.node.attributes.pos.y;
    }

    this.wrapper.style.left = this.x + 'px';
    this.wrapper.style.top = this.y + 'px';
    // This will update all the incomming connections
    Object.values(this.node.states).forEach((s) => s.view.updatePosition());
    // This will update all the outgoing connections
    this.node.outputs.forEach((o) => o.view.updatePosition());
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.node.setAttributes({ pos: { x, y } });
  }

  remove() {
    this.removeEventListeners();
    this.wrapper.remove();
  }
}
