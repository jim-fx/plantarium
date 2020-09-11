import './NodeStateView.scss';
import NodeState from 'model/NodeState';
import { stateToElement } from '@plantarium/ui';

export default class NodeStateView {
  wrapper = document.createElement('div');

  constructor(private nodeState: NodeState) {
    this.wrapper.classList.add('node-state-single-wrapper');

    const template = nodeState.template;

    const label = template.label ?? nodeState.key;
    if (typeof label === 'string') {
      const labelEl = document.createElement('p');
      labelEl.className = 'state-label';
      labelEl.innerHTML = label;
      this.wrapper.appendChild(labelEl);
    }

    if (template.external !== true) {
      const element = stateToElement(
        this.wrapper,
        template,
        nodeState.getValue(),
      );

      if (element)
        element.addEventListener('change', ({ detail }) => {
          this.nodeState.setValue(detail);
        });
    }

    nodeState.node.view.stateWrapper.appendChild(this.wrapper);
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
