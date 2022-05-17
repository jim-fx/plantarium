import type NodeOutput from './NodeOutput';
import type Node from './Node';
import type NodeInput from './NodeInput';
import type NodeSystem from './NodeSystem';
import NodeConnectionView from '../view/NodeConnectionView';
import { canSocketsConnect } from '../helpers';

interface ConnectionOptions {
  output: NodeOutput;
  input: NodeInput;
}

export default class NodeConnection {
  system!: NodeSystem;

  input!: NodeInput;
  output!: NodeOutput;

  type!: string;
  view!: NodeConnectionView;

  constructor(system: NodeSystem, { input, output }: ConnectionOptions) {

    // TODO: Dont connect if connection already exists
    if (output.connections.find(c => c.input === input)) {
      return;
    } else if (input?.connection?.output === output) {
      return;
    }

    if (!output || !input) return;

    this.system = system;

    const children = input.node.getChildren();

    if (children.includes(output.node)) throw new Error('Circular reference');

    if (!canSocketsConnect(output, input))
      throw new Error(
        "Can't connect type " + input.type + ' to ' + output.type,
      );

    this.output = output;
    this.input = input;

    if (system.options.view) {
      this.view = new NodeConnectionView(this);
    }

    this.output.setConnection(this);
    this.input.setConnection(this);

    this.output.node.system.save();
  }

  public joinNode(node: Node) {
    if (!this.isNodeJoinable(node)) return;
    this.system.isPaused = true;

    this.remove();

    this.output.node.connectTo(node, 0, node.getInputs()[0].key);
    const inputs = this.input.node.getInputs();
    const indexIn = inputs.indexOf(this.input);
    const keyIn = inputs[indexIn].key;
    node.connectTo(this.input.node, 0, keyIn);
    this.system.isPaused = false;
    node.update()
  }

  public isNodeJoinable(node: Node) {
    const outputType = this.input.type;
    const inputType = this.output.type;

    if (this.input.node === node || this.output.node === node) return false;

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
    if (this.view) this.view.remove();
    this.input.removeConnection();
    this.output.removeConnection(this);
  }

  deserialize() {
    return {
      id: this.input.node.attributes.id,
      out: this.indexOut,
      in: this.indexIn,
    };
  }

  get indexOut(): number {
    return this.output.node.outputs.indexOf(this.output);
  }

  get indexIn(): string {
    return this.input.key;
  }
}
