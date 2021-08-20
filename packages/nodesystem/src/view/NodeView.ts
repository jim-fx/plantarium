import type Node from '../model/Node';
import type System from '../model/NodeSystem';
import type NodeConnectionView from './NodeConnectionView';
import type InputView from './NodeInputView';
import type OutputView from './NodeOutputView';
import './NodeView.scss';

export default class NodeView {
  node: Node;
  wrapper: HTMLDivElement;
  outputWrapper: HTMLDivElement;
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

  constructor(node: Node) {
    this.node = node;

    this.system = node.system;

    this.wrapper = document.createElement('div');
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

    this.bindEventListeners();

    setTimeout(() => {
      const { width, height } = this.wrapper.getBoundingClientRect();
      this.width = width / this.system.view.s;
      this.height = height / this.system.view.s;
      this.setPosition(x, y);
    }, 100);
  }

  bindEventListeners() {
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
    this.wrapper.classList.remove(
      'node-active',
      'node-selected',
      'node-dragging',
    );
    this.wrapper.classList.add('node-' + s);
    this._state = s;
  }

  get state() {
    return this._state;
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

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.wrapper.style.left = x + 'px';
    this.wrapper.style.top = y + 'px';

    Object.values(this.node.states).forEach((s) => s?.view?.updatePosition());
    this.node.outputs.forEach((o) => o.view.updatePosition());
    this.node.setAttributes({ pos: { x, y } });
  }

  remove() {
    this.removeEventListeners();
    this.wrapper.remove();
  }
}
