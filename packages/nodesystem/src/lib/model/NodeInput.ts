import NodeInputView from '../view/NodeInputView';
import type NodeConnection from './NodeConnection';
import type Node from './Node';
import type NodeState from './NodeState';

export default class NodeInput {
  node: Node;
  view: NodeInputView;
  connection!: NodeConnection;
  type: string[];

  constructor(
    public state: NodeState,
    type: string[] | string,
    public key: string,
  ) {
    this.node = state.node;
    this.type = Array.isArray(type) ? type : [type];
  }

  bindView() {
    this.view = new NodeInputView(this);
  }

  removeConnection() {
    const conn = this.connection;
    delete this.connection;
    conn && conn.remove();
    this.node.setStateValue(this.key, undefined);
    this.state.setIsExternal(false);
  }

  setConnection(conn: NodeConnection) {
    if (this.connection) {
      this.connection.remove();
    }
    this.connection = conn;
    if (this.view) this.view.connection = conn.view;
    this.state.setIsExternal(true);
  }

  remove() {
    if (this.view) this.view.remove();
    this.removeConnection();
  }
}
