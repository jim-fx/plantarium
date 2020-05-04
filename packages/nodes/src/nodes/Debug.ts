import Node from 'model/Node';

import NodeInput from 'model/NodeInput';
import NodeSystem from 'model/NodeSystem';

import NodeView from 'view/NodeView';

class DebugNode extends Node {
  constructor(system: NodeSystem, props: NodeProps) {
    super(system, props);

    this.inputs = [new NodeInput(this, ['*'])];

    this.outputs = [];
  }

  compute(inputData: any[]) {
    return inputData[0];
  }
}

class DebugView extends NodeView {
  constructor(node: Node) {
    super(node);

    const d = document.createElement('div');

    node.on('computedData', (data: any) => {
      d.innerHTML = '';
      const p = document.createElement('p');
      p.innerHTML = data;
      d.append(p);
    });

    this.wrapper.appendChild(d);
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
