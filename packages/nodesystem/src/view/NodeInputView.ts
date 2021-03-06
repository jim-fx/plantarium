import './NodeInputView.scss';
import type Node from '../model/Node';
import type NodeInput from '../model/NodeInput';
import type NodeConnectionView from './NodeConnectionView';

export default class NodeInputView {
  node: Node;
  input: NodeInput;
  wrapper: HTMLDivElement;
  connection!: NodeConnectionView;

  private _y = 0;

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
          this.node.system.view.createFloatingConnection(
            connection.output,
            this,
          );
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

    this._y = input.state.view.y + input.state.view.height / 2;
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
    return this.node.view.x;
  }

  get y() {
    return this.node.view.y + this._y;
  }
}
