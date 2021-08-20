import type Node from '../model/Node';
import type NodeInput from '../model/NodeInput';
import type NodeConnectionView from './NodeConnectionView';
import './NodeInputView.scss';

export default class NodeInputView {
  node: Node;
  input: NodeInput;
  wrapper: HTMLDivElement;
  connection!: NodeConnectionView;

  constructor(input: NodeInput) {
    if (!input || !input.node) throw new Error('Somethings missing');

    this.input = input;
    this.node = input.node;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('node-input-wrapper');
    input.type.forEach((t) => {
      this.wrapper.classList.add(`socket-type-${t === '*' ? 'all' : t}`);
    });

    input.state.view.wrapper.appendChild(this.wrapper);

    this.wrapper.addEventListener(
      'mousedown',
      (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const connection = this.input.connection;
        if (connection) {
          connection.remove();
          this.node.system.view.createFloatingConnection(connection.output);
        } else {
          this.node.system.view.createFloatingConnection(this.input);
        }
      },
      false,
    );

    this.node.system.view.colorStore.on(input.type[0], (color) => {
      const col = window
        .getComputedStyle(this.wrapper, null)
        .getPropertyValue('background-color');
      this.wrapper.style.backgroundColor =
        col !== 'rgba(0, 0, 0, 0)' ? col : color;
    });
  }

  rect: DOMRect;
  updatePosition() {
    this.rect = this.wrapper.getBoundingClientRect();

    this?.connection?.setPosition({ x2: this.x, y2: this.y });
  }

  remove() {
    this.wrapper.remove();
    if (this.connection) this.connection.remove();
  }

  set state(v: string) {
    this.wrapper.classList.forEach((c) => {
      if (c.includes('socket-state-')) this.wrapper.classList.remove(c);
    });
    if (v && v.length) this.wrapper.classList.add('socket-state-' + v);
  }

  get x() {
    return this.node.view.x - 3;
  }

  get y() {
    const system = this.node.system.view;
    const y =
      (this.rect.y + this.rect.height / 2 - system.y - system.top) / system.s -
      system.height / 2;
    return y;
  }
}
