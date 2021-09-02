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

		if (!template.external) {
			const element = stateToElement({
				target: this.input,
				template,
				value: nodeState.getValue(),
			});

			if (element) {
				element.$on('change', ({ detail }) => {
					if (typeof detail !== 'undefined' && !Number.isNaN(detail)) {
						this.nodeState.setValue(detail);
					} else {
						console.log('PROBLEM', detail);
					}
				});
			}
		}

		nodeState.node.view.stateWrapper.appendChild(this.wrapper);
		this.wrapper.appendChild(this.input);
	}

	private rect: DOMRect;

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
