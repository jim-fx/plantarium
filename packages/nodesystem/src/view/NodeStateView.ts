import { stateToElement } from '@plantarium/ui';
import type NodeState from '../model/NodeState';
import './NodeStateView.scss';

export default class NodeStateView {
  wrapper = document.createElement('div');
  input = document.createElement('div');

  constructor(private nodeState: NodeState) {
    this.wrapper.classList.add('node-state-single-wrapper');
    this.input.classList.add('node-state-input');

    const template = nodeState.template;

    const label = template.label ?? nodeState.key;
    if (typeof label === 'string') {
      const labelEl = document.createElement('p');
      labelEl.className = 'state-label';
      labelEl.innerHTML = label;
      this.wrapper.appendChild(labelEl);
    }

    template['fullWidth'] = true;

    if (!template.external) {
      const element = stateToElement({
        target: this.input,
        template,
        value: nodeState.getValue(),
      });

      if (element) {
        element.$on('change', ({ detail }) => {
          this.nodeState.setValue(detail);
        });
      }
    }

    nodeState.node.view.stateWrapper.appendChild(this.wrapper);
    this.wrapper.appendChild(this.input);
  }

  get y() {
    return (
      this.wrapper.getBoundingClientRect().y -
      this.nodeState.node.view.wrapper.getBoundingClientRect().y
    );
  }

  get height() {
    return this.wrapper.getBoundingClientRect().height;
  }

  setActive(isActive: boolean) {
    this.wrapper.classList[isActive ? 'remove' : 'add']('disabled');
  }
}
