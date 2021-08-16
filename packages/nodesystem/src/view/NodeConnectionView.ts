import ConnectionView from './ConnectionView';
import type NodeInputView from './NodeInputView';
import type NodeOutputView from './NodeOutputView';
import type NodeConnection from '../model/NodeConnection';
import type Node from '../model/Node';

export default class NodeConnectionView extends ConnectionView {
  connection!: NodeConnection;

  input!: NodeInputView;
  output!: NodeOutputView;

  private _unsubscribeMoveIn: () => void;
  private _unsubscribeMoveOut: () => void;

  constructor(conn: NodeConnection) {
    super({}, conn.input.node.system);
    this.connection = conn;

    this.input = conn.input.view;
    this.output = conn.output.view;

    const { x: x1, y: y1 } = conn.input.view;
    const { x: x2, y: y2 } = conn.output.view;

    this.hoverPath = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path',
    );
    this.hoverPath.classList.add('node-connection-hover');
    this.hoverPath.setAttribute('vector-effect', 'non-scaling-stroke');
    this.system.view.svg.append(this.hoverPath);

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

    this.setPosition({ x1, y1, x2, y2 });

    this._unsubscribeMoveOut = conn.input.node.view.on(
      'move',
      () => {
        const { x, y } = conn.input.view;
        if (x && y) this.setPosition({ x1: x, y1: y });
      },
      5,
    );

    this._unsubscribeMoveIn = conn.output.node.view.on(
      'move',
      () => {
        const { x, y } = conn.output.view;
        if (x && y) this.setPosition({ x2: x, y2: y });
      },
      5,
    );

    conn.input.node.system.view.colorStore.on(conn.input.type[0], (color) => {
      this.path.style.stroke = color;
    });
  }

  handleNodeOver(node: Node) {
    if (this.connection.isNodeJoinable(node)) {
      node.view.hoveredConnection = this;
      this.path.classList.add('hover-active');
    }
  }

  handleNodeOut(node: Node) {
    if (node && node.view.hoveredConnection === this) {
      delete node.view.hoveredConnection;
    }
    this.path.classList.remove('hover-active');
  }

  remove() {
    this._unsubscribeMoveIn();
    this._unsubscribeMoveOut();
    super.remove();
  }
}
