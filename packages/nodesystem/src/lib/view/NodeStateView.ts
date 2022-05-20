import { stateToElement } from '@plantarium/ui';
import type { SvelteComponent } from 'svelte';
import type NodeState from '../model/NodeState';
import './NodeStateView.scss';

export default class NodeStateView {
  wrapper = document.createElement('div');
  input = document.createElement('div');
  helpWrapper: HTMLDivElement;
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
          if (typeof detail !== 'undefined' && !Number.isNaN(detail)) {
            this.nodeState.setValue(detail);
          }
        });
      }
    }

    if (template.description) {
      this.helpWrapper = document.createElement("div");
      this.helpWrapper.classList.add("nodeview-help-wrapper", "nodestate-help-wrapper");

      this.helpWrapper.innerHTML = `<i>${template.label || this.nodeState.key}</i><br><p>${template.description}</p>`

      this.wrapper.appendChild(this.helpWrapper)
    }

    nodeState.node.view.stateWrapper.appendChild(this.wrapper);
    this.wrapper.appendChild(this.input);
  }

  private rect: DOMRect;

  updateValue() {
    setTimeout(() => {
      if (this.element) {
        this.element.value = this.nodeState.getValue();
      }
    }, 50);
  }

  updatePosition() {
    this.rect = this.wrapper.getBoundingClientRect();
    this.nodeState.getInput()?.view?.updatePosition();
  }

  setErrorState(err: boolean) {
    if (err) {
      this.wrapper.classList.add("state-error")
    } else {
      this.wrapper.classList.remove("state-error")
    }
  }

  get y() {
    return this.rect.y - this.nodeState.node.view.y;
  }

  get height() {
    return this.rect.height;
  }

  setActive(isActive: boolean) {
    this.wrapper.classList[isActive ? 'remove' : 'add']('disabled');
    this.nodeState.node.getInputs().forEach(s => s.view.updatePosition())
  }
}
