import { logger } from '@plantarium/helpers';
import NodeConnectionView from '../view/NodeConnectionView';
import type Node from './Node';
import type NodeInput from './NodeInput';
import type NodeOutput from './NodeOutput';
import type NodeSystem from './NodeSystem';

const log = logger('node');

interface ConnectionOptions {
  input: NodeOutput;
  output: NodeInput;
}

export default class NodeConnection {
  /*
   * output is relative to the connection
   */
  output!: NodeInput;
  /*
   * input is relative to the connection
   */
  input!: NodeOutput;

  type!: string;
  view!: NodeConnectionView;

  constructor(
    private system: NodeSystem,
    { input, output }: ConnectionOptions,
  ) {
    if (!output || !input) {
      log.warn('Missing input or output', { input, output });
    }

    if (input.connections.find((c) => c.output === output)) {
      log.warn('lbur');
      return;
    } else if (output?.connection?.input === input) {
      log.warn('ldasdur');
      return;
    }

    const children = input.node.getChildren();
    if (children.includes(output.node)) throw new Error('Circular reference');
    if (!input.canConnectTo(output))
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

    this.input.node.connectTo(node.getInputs()[0]);

    node.connectTo(this.output);

    this.system.isPaused = false;
    node.update();
  }

  public isNodeJoinable(node: Node) {
    const inputType = this.input.type;
    const outputType = this.output.type;

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
    this.input.removeConnection(this);
    this.output.removeConnection();
  }

  deserialize() {
    return {
      id: this.output.node.attributes.id,
      out: this.indexOut,
      in: this.indexIn,
    };
  }

  get indexOut(): number {
    return this.output.node.outputs.indexOf(this.input);
  }

  get indexIn(): string {
    return this.output.key;
  }
}
