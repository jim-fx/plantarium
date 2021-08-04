import type Node from '../model/Node';
import type NodeOutput from '../model/NodeOutput';
import type NodeConnectionView from './NodeConnectionView';
import './NodeOutputView.scss';

export default class NodeOutputView {
  node: Node;
  output: NodeOutput;
  wrapper: HTMLDivElement;
  connections: NodeConnectionView[] = [];

  constructor(output: NodeOutput) {
    this.output = output;
    this.node = output.node;

    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('node-output-wrapper');
    this.wrapper.classList.add(`socket-type-${output.type}`);
    // this.node.view.outputWrapper.appendChild(this.wrapper);

    output.node.view.wrapper.appendChild(this.wrapper);

    this.wrapper.addEventListener(
      'mousedown',
      (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.node.system.view.createFloatingConnection(this.output);
      },
      false,
    );

    this.node.system.view.colorStore.on(output.type, (color) => {
      const col = window
        .getComputedStyle(this.wrapper, null)
        .getPropertyValue('background-color');

      this.wrapper.style.backgroundColor =
        col !== 'rgba(0, 0, 0, 0)' ? col : color;
    });
  }

  remove() {
    this.wrapper.remove();
    this.connections.forEach((c) => c.remove());
  }

  set state(v: string) {
    this.wrapper.classList.forEach((c) => {
      if (c.includes('socket-state-')) this.wrapper.classList.remove(c);
    });
    if (v && v.length) this.wrapper.classList.add('socket-state-' + v);
  }

  get x() {
    return this.node.view.x + this.node.view.width;
  }

  get y() {
    return this.node.view.y + 10;
  }
}
