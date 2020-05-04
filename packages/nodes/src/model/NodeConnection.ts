import NodeViewConnection from 'view/NodeConnectionView';
import NodeOutput from './NodeOutput';
import NodeInput from './NodeInput';
import NodeSystem from './NodeSystem';
import NodeConnectionView from 'view/NodeConnectionView';

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

    if (!output || !input) return;

    this.system = system;

    const children = input.node.getChildren();

    if (children.includes(output.node)) throw new Error('Circular reference');

    if (!input.type.includes(output.type) && !input.type.includes('*'))
      throw new Error(
        "Can't connect type " + input.type + ' to ' + output.type,
      );

    this.output = output;
    this.input = input;

    if (system.options.view) {
      this.view = new NodeViewConnection(this);
    }

    this.output.setConnection(this);
    this.input.setConnection(this);

    this.output.node.system.save();
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

  updateDownstream(data: any) {
    this.input.updateDownstream(data);
  }

  get indexOut() {
    return this.output.node.outputs.indexOf(this.output);
  }

  get indexIn() {
    return this.input.node.inputs.indexOf(this.input);
  }
}
