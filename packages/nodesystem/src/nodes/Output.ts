import Node from '../model/Node';
import NodeState from '../model/NodeState';
import type NodeSystem from '../model/NodeSystem';
import NodeView from '../view/NodeView';

class OutputNode extends Node {
  constructor(system: NodeSystem, props: NodeProps) {
    super(system, props);

    this.states = {
      input: new NodeState(this, 'input', {
        type: '*',
        external: true,
        label: false,
      }),
    };
    this.outputs = [];
  }

  compute({ input }) {
    return input;
  }
}

class OutputView extends NodeView {
  constructor(node: Node) {
    super(node);

    const d = document.createElement('p');

    d.style.margin = '0px';
    d.style.padding = '4px';
    d.style.color = 'white';
    d.style.fontWeight = 'bold';

    node.on('computedData', (data) => {
      d.innerHTML = JSON.stringify(data, null, 2);
    });

    this.wrapper.appendChild(d);
  }
}

export default {
  title: 'Output',
  meta: {
    description: 'Outputs the final value',
  },
  node: OutputNode,
  view: OutputView,
};
