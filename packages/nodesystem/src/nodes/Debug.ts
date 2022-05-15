import Node from '../model/Node';

import NodeState from '../model/NodeState';
import type NodeSystem from '../model/NodeSystem';
import { NodeProps } from '../types';

import NodeView from '../view/NodeView';

class DebugNode extends Node {
  constructor(system: NodeSystem, props: NodeProps) {
    super(system, props);

    this.states = {
      input: new NodeState(this, 'input', { type: '*' }),
    };

    this.outputs = [];
  }

  compute({ input }) {
    return input;
  }
}

class DebugView extends NodeView {
  constructor(node: Node) {
    super(node);

    const d = document.createElement('div');

    node.on('computedData', (data: unknown) => {
      d.innerHTML = '';
      const p = document.createElement('p');
      p.innerHTML = JSON.stringify(data, null, ' ');
      d.append(p);
    });

    this.wrapper.appendChild(d);
  }
}

export default {
  title: 'Debug',
  meta: {
    description: 'Outputs any inputs for debug purposes',
  },
  node: DebugNode,
  view: DebugView,
};
