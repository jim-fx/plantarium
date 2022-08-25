import { SocketType } from '../types';
import NodeOutputView from '../view/NodeOutputView';
import type Node from './Node';
import type NodeConnection from './NodeConnection';
import NodeInput from './NodeInput';

export default class NodeOutput {
  node: Node;
  view!: NodeOutputView;
  isOutput = true;
  connections: NodeConnection[] = [];
  type: string;
  _type: SocketType.OUTPUT = SocketType.OUTPUT;

  constructor(node: Node, type: string) {
    this.node = node;
    this.type = type;

    if (Array.isArray(type))
      throw new Error('Output can only output one type, not ' + type);
  }

  canConnectTo(input: NodeInput) {
    return input.type.includes('*') || input.type.includes(this.type);
  }

  bindView() {
    this.view = new NodeOutputView(this);
  }

  connectTo(input: NodeInput | Node) {
    if (input instanceof NodeInput) {
      return this.node.connectTo(input);
    }

    const outputs = input.getInputs();

    const output = outputs.find((out) => out.canConnectTo(this));

    if (output) {
      this.node.connectTo(output);
    }
  }

  removeConnection(conn: NodeConnection) {
    if (!this.connections.length) return;
    const index = this.connections.indexOf(conn);
    if (index === -1) return;
    this.connections.splice(index, 1);
    this.node.disconnectFrom(conn.output.node, conn.output);
    if (this.view) this.view.connections.splice(index, 1);
  }

  setConnection(conn: NodeConnection) {
    this.connections.push(conn);
    if (this.view) this.view.connections.push(conn.view);
    this.node.update();
  }

  remove() {
    this.connections.forEach((c) => c.remove());
  }
}
