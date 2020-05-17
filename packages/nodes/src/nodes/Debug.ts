import Node from 'model/Node';

import NodeSystem from 'model/NodeSystem';

import NodeView from 'view/NodeView';
import NodeState from 'model/NodeState';

class DebugNode extends Node {
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

class DebugView extends NodeView {
  constructor(node: Node) {
    super(node);

    const d = document.createElement('div');
    const p = document.createElement('p');
    d.append(p);

    node.on('computedData', (data: unknown) => {
      p.innerHTML = JSON.stringify(data);
    });

    setTimeout(() => {
      this.wrapper.appendChild(d);
    }, 50);
  }
}

export default {
  name: 'Debug',
  meta: {
    description: 'Outputs any inputs for debug purposes',
  },
  node: DebugNode,
  view: DebugView,
};
