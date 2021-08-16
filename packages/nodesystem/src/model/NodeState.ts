import { EventEmitter } from '@plantarium/helpers';
import NodeStateView from '../view/NodeStateView';
import type Node from './Node';
import NodeInput from './NodeInput';

export default class NodeState extends EventEmitter {
  isExternal = false;
  private input: NodeInput;

  view: NodeStateView;

  private value: unknown;

  constructor(
    public node: Node,
    public key: string,
    public template: ValueTemplate,
  ) {
    super();

    this.value = node.state[key] ?? template.defaultValue ?? template.value;
    this.node._state[key] = this.value;

    if (!this.template.internal) {
      this.input = new NodeInput(this, template.type, key);
    }
  }

  setIsExternal(isExternal = false) {
    this.isExternal = isExternal;
    this?.view?.setActive(!isExternal);
  }

  getValue() {
    return this.value;
  }

  setValue(value: unknown) {
    if (!this.isExternal) this.value = value;

    this.node._state[this.key] = value;

    this.node.update();
  }

  remove() {
    //
  }

  getInput() {
    return this.input;
  }

  bindView() {
    this.view = new NodeStateView(this);
    this.input && this.input.bindView();
  }
}
