import NodeInputView from 'view/NodeInputView';
import { EventEmitter } from '@plantarium/helpers';
import NodeConnection from './NodeConnection';
import Node from './Node';
import NodeState from './NodeState';

export default class NodeInput extends EventEmitter {
  state: NodeState;
  node: Node;
  view!: NodeInputView;
  connection!: NodeConnection;
  type: string[];
  key: string;

  constructor(state: NodeState, key: string, type: string[] | string) {
    super();
    this.state = state;
    this.node = state.getNode();
    this.type = Array.isArray(type) ? type : [type];
    this.key = key;
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

  updateDownstream(data) {
    this.node.setStateValue(this.key, data);
  }

  setConnection(conn: NodeConnection) {
    if (this.connection) {
      this.connection.remove();
    }
    this.connection = conn;
    if (this.view) this.view.connection = conn.view;
    this.emit('connected', conn);
  }

  remove() {
    if (this.view) this.view.remove();
  }
}
