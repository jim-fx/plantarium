import * as p from '@plantarium/ui';

console.log({ p })

const stateToElement = p.stateToElement;
import type { SvelteComponent } from 'svelte';
import type NodeState from '../model/NodeState';
import './NodeStateView.scss';

export default class NodeStateView {
  wrapper = document.createElement('div');
  input = document.createElement('div');
  element: SvelteComponent;

  constructor(private nodeState: NodeState) {
    this.wrapper.classList.add('node-state-single-wrapper');
    this.input.classList.add('node-state-input');

    const template = nodeState.template;

    const label = template.label || nodeState.key;
    if (typeof label === 'string') {
      const labelEl = document.createElement('p');
      labelEl.className = 'state-label';
      labelEl.innerHTML = label;
      this.wrapper.appendChild(labelEl);
    }

    if (template?.label === false) {
      this.wrapper.classList.add('hide-label');
    }

    if (!template.external && template.type !== "*") {
      this.element = stateToElement({
        target: this.input,
        template,
        value: nodeState.getValue(),
      });

      if (this.element) {
        this.element.$on('change', ({ detail }) => {
          // if (this.isPaused) return;
          // this.isPaused = true;
          if (typeof detail !== 'undefined' && !Number.isNaN(detail)) {
            this.nodeState.setValue(detail);
          }
          // this.isPaused = false;
        });
      }
    }

    nodeState.node.view.stateWrapper.appendChild(this.wrapper);
    this.wrapper.appendChild(this.input);
  }

  private rect: DOMRect;

  updateValue() {
    // if (this.isPaused) return;
    // this.isPaused = true;
    setTimeout(() => {
      if (this.element) {
        this.element.value = this.nodeState.getValue();
      }
    }, 50);
    // this.isPaused = false;
  }

  updatePosition() {
    this.rect = this.wrapper.getBoundingClientRect();
    this.nodeState.getInput()?.view?.updatePosition();
  }

  get y() {
    return this.rect.y - this.nodeState.node.view.y;
  }

  get height() {
    return this.rect.height;
  }

  setActive(isActive: boolean) {
    this.wrapper.classList[isActive ? 'remove' : 'add']('disabled');
  }
}
