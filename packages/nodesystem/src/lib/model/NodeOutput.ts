import NodeOutputView from '../view/NodeOutputView';
import type Node from './Node';
import type NodeConnection from './NodeConnection';
import type NodeInput from './NodeInput';

export default class NodeOutput {
  node: Node;
  view!: NodeOutputView;
  isOutput = true;
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

  connectTo(input: NodeInput) {
    const indexOut = this.node.outputs.indexOf(this);
    return this.node.connectTo(input.node, indexOut, input.key);
  }

  removeConnection(conn: NodeConnection) {
    if (!this.connections.length) return;
    const index = this.connections.indexOf(conn);
    if (index === -1) return;
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
