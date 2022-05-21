import { EventEmitter } from '@plantarium/helpers';
import type { ValueTemplate } from '../types';
import NodeStateView from '../view/NodeStateView';
import type Node from './Node';
import NodeInput from './NodeInput';

export default class NodeState extends EventEmitter {
  isExternal = false;
  isOkay = true;
  private input: NodeInput;

  view: NodeStateView;

  private value: unknown;

  constructor(
    public node: Node,
    public key: string,
    public template: ValueTemplate,
  ) {
    super();

    this.value = node.state[key] ?? template.value;
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

  private checkErrors(value = this.template.value) {

    if (this.template?.required && value === undefined) {
      this.isOkay = false;

      if (this.node.view) {
        this.node.view.showErrors(`Input <b>${this.template?.label || this.key}</b> is required`)
      }

    } else {
      this.isOkay = true;
      this.node.view.showErrors()
    }


    if (this?.view) {
      this.view.setErrorState(!this.isOkay)
    }

  }

  setValue(value: unknown = this.template.value) {
    if (!this.isExternal) {
      if (this.node.enableUpdates) {
        this.node.system.history.addAction();
      }
      this.value = value;
    }
    this.node._state[this.key] = value;
    this.checkErrors(value)
    if (this.node.enableUpdates) {
      this?.view.updateValue();
      this.isOkay && this.node.update();
    }
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
    this.checkErrors()
  }
}
