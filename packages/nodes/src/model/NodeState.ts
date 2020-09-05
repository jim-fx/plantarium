import Node from './Node';
import NodeStateView from 'view/NodeStateView';
import NodeInput from './NodeInput';
import { EventEmitter } from '@plantarium/helpers';

export default class NodeState extends EventEmitter {
  private node: Node;
  private key: string;
  private state: NodeStateTemplate;
  private view: NodeStateView;
  private input: NodeInput;
  private value;

  constructor(node: Node, key: string, state: NodeStateTemplate) {
    super();
    this.node = node;
    this.key = key;
    this.state = state;
    if (state.external !== false) {
      this.input = new NodeInput(this, key, state.type);
      this.input.on('connected', () => this.emit('connected'));
      this.input.on('disconnected', () => this.emit('disconnected'));
      node.inputs[key] = this.input;
    }
  }

  bindView() {
    this.view = new NodeStateView(this, this.state);
    this.input && this.input.bindView();
  }

  setValue(value) {
    this.value = value;
    this.node.setStateValue(this.key, this.value);
  }

  getInput() {
    return this.input;
  }
  getNode() {
    return this.node;
  }
  getKey() {
    return this.key;
  }
  getView() {
    return this.view;
  }
}
