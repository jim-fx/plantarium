import ConnectionView from './ConnectionView';
import NodeInputView from './NodeInputView';
import NodeOutputView from './NodeOutputView';
import NodeConnection from 'model/NodeConnection';

export default class NodeConnectionView extends ConnectionView {
  connection!: NodeConnection;

  input!: NodeInputView;
  output!: NodeOutputView;

  private _unsubscribeMoveIn: () => void;
  private _unsubscribeMoveOut: () => void;

  constructor(conn: NodeConnection) {
    super({}, conn.input.node.system);

    const { x: x1, y: y1 } = conn.input.view;
    const { x: x2, y: y2 } = conn.output.view;

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

  remove() {
    this._unsubscribeMoveIn();
    this._unsubscribeMoveOut();
    super.remove();
  }
}
