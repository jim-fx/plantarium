import Node from 'model/Node';
import NodeSystem from 'model/NodeSystem';

import NodeView from 'view/NodeView';
import NodeState from 'model/NodeState';

class OutputNode extends Node {
  constructor(system: NodeSystem, props: NodeProps) {
    super(system, props);

    this.states.push(
      new NodeState(this, 'input', { type: '*', internal: false }),
    );
  }

  compute({ input }) {
    return input;
  }
}

class OutputView extends NodeView {
  constructor(node: Node) {
    super(node);

    const d = document.createElement('p');

    d.style.padding = '0px 7px';
    d.style.margin = '0px';
    d.style.marginBottom = '7px';

    node.on('computedData', (data) => {
      d.innerHTML = JSON.stringify(data, null, 2);
    });

    setTimeout(() => {
      this.wrapper.appendChild(d);
    }, 50);
  }
}

export default {
  name: 'Output',
  meta: {
    description: 'Outputs the final value',
  },
  node: OutputNode,
  view: OutputView,
};
