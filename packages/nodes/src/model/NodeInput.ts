import NodeInputView from 'view/NodeInputView';
import { EventEmitter } from '@plantarium/helpers';
import NodeConnection from './NodeConnection';
import Node from './Node';

export default class NodeInput extends EventEmitter {
  node: Node;
  view!: NodeInputView;
  connection!: NodeConnection;
  type: string[];

  constructor(node: Node, type: string[] | string) {
    super();
    this.node = node;
    this.type = Array.isArray(type) ? type : [type];
  }

  bindView() {
    this.view = new NodeInputView(this);
  }

  removeConnection() {
    delete this.connection;
    delete this.view.connection;
    this.node.updateInput(this, undefined);
  }

  updateDownstream(data: any) {
    this.node.updateInput(this, data);
  }

  setConnection(conn: NodeConnection) {
    if (this.connection) {
      this.connection.remove();
    }
    this.connection = conn;
    if (this.view) this.view.connection = conn.view;
  }

  remove() {
    if (this.view) this.view.remove();
  }
}
