import NodeInputView from '../view/NodeInputView';
import { EventEmitter } from '@plantarium/helpers';
import type NodeConnection from './NodeConnection';
import type Node from './Node';
import type NodeState from './NodeState';

export default class NodeInput extends EventEmitter {
  node: Node;
  view: NodeInputView;
  connection!: NodeConnection;
  type: string[];

  constructor(
    public state: NodeState,
    type: string[] | string,
    public key: string,
  ) {
    super();
    this.node = state.node;
    this.type = Array.isArray(type) ? type : [type];
  }

  bindView() {
    this.view = new NodeInputView(this);
  }

  removeConnection() {
    delete this.connection;
    delete this.view.connection;
    this.node.setStateValue(this.key, undefined);
    this.emit('disconnected');
  }

  setConnection(conn: NodeConnection) {
    if (this.connection) {
      this.connection.remove();
    }
    this.connection = conn;
    if (this.view) this.view.connection = conn.view;
    this.emit('connected');
  }

  remove() {
    if (this.view) this.view.remove();
  }
}
