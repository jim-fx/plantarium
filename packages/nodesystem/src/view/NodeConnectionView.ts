import ConnectionView from './ConnectionView';
import type NodeInputView from './NodeInputView';
import type NodeOutputView from './NodeOutputView';
import type NodeConnection from '../model/NodeConnection';
import type { Node } from '..';

export default class NodeConnectionView extends ConnectionView {
  connection!: NodeConnection;

  input!: NodeInputView;
  output!: NodeOutputView;

  private _unsubscribeMoveIn: () => void;
  private _unsubscribeMoveOut: () => void;

  constructor(conn: NodeConnection) {
    super({}, conn.input.node.system);

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
      if (activeNode && activeNode.view.hoveredConnection !== this) {
        if (this.isNodeJoinable(activeNode)) {
          activeNode.view.hoveredConnection = this;
          this.path.classList.add('hover-active');
        }
      }
    });

    this.hoverPath.addEventListener('mouseout', () => {
      const { activeNode } = this.system.view;
      if (activeNode && activeNode.view.hoveredConnection === this) {
        delete activeNode.view.hoveredConnection;
      }
      this.path.classList.remove('hover-active');
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
  }

  public joinNode(node: Node) {
    if (!this.isNodeJoinable(node)) return;

    this.remove();
    //TODO(max) better handle getting the index of which input/output it should connect to

    this.output.node.connectTo(node, 0, node.getInputs()[0].key);
    node.connectTo(this.input.node, 0, this.input.node.getInputs()[0].key);
  }

  private isNodeJoinable(node: Node) {
    const outputType = this.input.input.type;
    const inputType = this.output.output.type;

    const nodeInputs = node.getInputs();
    if (
      !nodeInputs.length ||
      !nodeInputs.find((input) => input.type.includes(inputType))
    ) {
      return false;
    }

    const nodeOutputs = node.outputs;
    if (
      !nodeOutputs.length ||
      !nodeOutputs.find(
        (output) =>
          outputType.includes(output.type) || outputType.includes('*'),
      )
    ) {
      return false;
    }

    return true;
  }

  remove() {
    this._unsubscribeMoveIn();
    this._unsubscribeMoveOut();
    super.remove();
  }
}
