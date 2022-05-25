import type Node from '../model/Node';
import type NodeConnection from '../model/NodeConnection';
import ConnectionView from './ConnectionView';
import type NodeInputView from './NodeInputView';
import type NodeOutputView from './NodeOutputView';

export default class NodeConnectionView extends ConnectionView {
  connection!: NodeConnection;

  input!: NodeOutputView;
  output!: NodeInputView;

  constructor(conn: NodeConnection) {
    conn.input.view.updatePosition()
    conn.output.view.updatePosition()
    super({ x2: conn.input.view.x, y2: conn.input.view.y, x1: conn.output.view.x, y1: conn.output.view.y }, conn.output);
    this.connection = conn;

    this.input = conn.input.view;
    this.output = conn.output.view;

    this.hoverPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    this.hoverPath.classList.add('node-connection-hover');
    this.hoverPath.setAttribute('vector-effect', 'non-scaling-stroke');
    this.svg.append(this.hoverPath);

    this.hoverPath.addEventListener('mouseover', () => {
      const { activeNode } = this.system.view;
      if (
        activeNode &&
        activeNode.view.active &&
        activeNode.view.hoveredConnection !== this
      ) {
        this.handleNodeOver(activeNode);
      }
    });

    this.hoverPath.addEventListener('mouseout', () => {
      const { activeNode } = this.system.view;
      this.handleNodeOut(activeNode);
    });

    const colorStore = conn.input.node.system.view.colorStore;

    colorStore.onType(conn.input.type, (color) => {
      this.path.style.stroke = color;
      this.svg.style.setProperty("--socket-color", color);
    });

    this.input.updatePosition()

  }

  handleNodeOver(node: Node) {
    if (this.connection.isNodeJoinable(node)) {
      node.view.hoveredConnection = this;
      this.path.classList.add('hover-active');
      this.hoverPath.classList.add('hover-active');
    }
  }

  handleNodeOut(node: Node) {
    if (node && node.view.hoveredConnection === this) {
      delete node.view.hoveredConnection;
    }
    this.hoverPath.classList.remove('hover-active');
    this.path.classList.remove('hover-active');
  }

  remove() {
    super.remove();
  }
}
