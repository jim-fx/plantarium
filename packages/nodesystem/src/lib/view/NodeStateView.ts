import { Icon, stateToElement } from '@plantarium/ui';
import type { SvelteComponent } from 'svelte';
import type NodeState from '../model/NodeState';
import './NodeStateView.scss';

export default class NodeStateView {
  wrapper = document.createElement('div');
  input = document.createElement('div');
  private visibleInput?: HTMLSpanElement;
  helpWrapper: HTMLDivElement;
  element: SvelteComponent;
  hideable = false;
  visible = false;

  constructor(private nodeState: NodeState) {
    this.wrapper.classList.add('node-state-single-wrapper');
    this.input.classList.add('node-state-input');

    const template = nodeState.template;

    const stateHeader = document.createElement('div');
    stateHeader.classList.add('node-state-header');

    if ('hidden' in template) {
      this.hideable = true;
      this.wrapper.classList.add('node-state-hideable');
      this.visibleInput = document.createElement('span');
      const icon = new Icon({
        target: this.visibleInput,
        props: { name: 'pin', active: true }
      })
      // Bruuuuuh, dis be one long asss line
      let visible = !!this.nodeState?.node?.attributes?.visible?.includes(
        this.nodeState.key,
      );
      icon.$set({ active: visible });
      this.setVisible(visible);
      this.visibleInput.addEventListener('click', () => {
        visible = !visible;
        icon.$set({ active: visible })
        this.setVisible(visible)
      });
      stateHeader.appendChild(this.visibleInput);

      setTimeout(() => {
        if (this.nodeState.getInput()?.connection) {
          this.setVisible(true);
          this.updatePosition();
        }
      }, 20);
    }

    const label = template.label || nodeState.key;
    if (typeof label === 'string') {
      const labelEl = document.createElement('p');
      labelEl.className = 'state-label';
      labelEl.innerHTML = label;
      stateHeader.appendChild(labelEl);
    }

    if (template?.label === false) {
      this.wrapper.classList.add('hide-label');
    }

    if (!template.external && template.type !== '*') {
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
      this.helpWrapper = document.createElement('div');
      this.helpWrapper.classList.add(
        'nodeview-help-wrapper',
        'nodestate-help-wrapper',
      );

      this.helpWrapper.innerHTML = `<i>${template.label || this.nodeState.key
        }</i><br><p>${template.description}</p>`;

      this.wrapper.appendChild(this.helpWrapper);
    }

    this.wrapper.appendChild(stateHeader);
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

  setVisible(visible = false) {
    if (this.hideable) {
      this.visible = visible;
      if (visible) {
        this.wrapper.classList.add('node-state-visible');
      } else {
        this.wrapper.classList.remove('node-state-visible');
      }
    }
    this.nodeState.node.save();
  }

  updatePosition() {
    this.rect = this.wrapper.getBoundingClientRect();
    this.nodeState.getInput()?.view?.updatePosition();
  }

  setErrorState(err: boolean) {
    if (err) {
      this.wrapper.classList.add('state-error');
    } else {
      this.wrapper.classList.remove('state-error');
    }
  }

  get y() {
    return this.rect.y - this.nodeState.node.view.y;
  }

  get height() {
    return this.rect.height;
  }

  setActive(isActive: boolean) {
    if (this.nodeState.node.view.state === 'stateselect') this.setVisible(true);
    this.wrapper.classList[isActive ? 'remove' : 'add']('disabled');
    this.nodeState.node.getInputs().forEach((s) => s.view.updatePosition());
  }
}
