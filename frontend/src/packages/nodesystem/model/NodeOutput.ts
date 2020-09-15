import NodeOutputView from '../view/NodeOutputView';
import Node from './Node';
import NodeConnection from './NodeConnection';

export default class NodeOutput {
  node: Node;
  view!: NodeOutputView;
  connections: NodeConnection[] = [];
  type: string;

  constructor(node: Node, type: string) {
    this.node = node;
    this.type = type;

    if (Array.isArray(type))
      throw new Error('Output can only output one type, not ' + type);
  }

  bindView() {
    this.view = new NodeOutputView(this);
  }

  removeConnection(conn: NodeConnection) {
    const index = this.connections.indexOf(conn);
    this.connections.splice(index, 1);
    this.node.disconnectFrom(conn.input.node, conn.indexIn, conn.indexOut);
    if (this.view) this.view.connections.splice(index, 1);
  }

  setConnection(conn: NodeConnection) {
    this.connections.push(conn);
    if (this.view) this.view.connections.push(conn.view);
  }

  remove() {
    this.connections.forEach((c) => c.remove());
  }
}
