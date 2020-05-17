import './NodeStateView.scss';
import NodeState from 'model/NodeState';
import Node from 'model/Node';
import { stateToElement } from '@plantarium/ui';

export default class NodeStateView {
  private node: Node;
  private state: NodeState;
  wrapper = document.createElement('div');
  outerWrapper = document.createElement('div');

  constructor(state: NodeState, template: NodeStateTemplate) {
    this.state = state;
    this.node = state.getNode();

    // Markup stuff
    this.wrapper.classList.add('node-state-wrapper');
    this.outerWrapper.classList.add('node-state-outer-wrapper');
    this.node.view.wrapper.appendChild(this.outerWrapper);
    this.outerWrapper.appendChild(this.wrapper);

    if (template.label !== false) {
      const label = document.createElement('p');
      label.innerHTML =
        typeof template.label === 'string' ? template.label : state.getKey();
      this.wrapper.appendChild(label);
    }

    this.state.on('connected', () => {
      this.disable();
    });

    this.state.on('disconnected', () => {
      this.enable();
    });

    if (template.internal !== false) {
      const value = this.node.state[this.state.getKey()];
      const element = stateToElement(template, value);
      this.wrapper.appendChild(element);
      element.addEventListener('change', ({ detail }) => {
        this.state.setValue(detail);
      });
    }
  }

  disable() {
    this.outerWrapper.classList.add('node-state-disabled');
  }

  enable() {
    this.outerWrapper.classList.remove('node-state-disabled');
  }
}
