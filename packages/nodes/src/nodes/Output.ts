import Node from 'model/Node';
import NodeInput from 'model/NodeInput';
import NodeSystem from 'model/NodeSystem';

import NodeView from 'view/NodeView';

class OutputNode extends Node {
  constructor(system: NodeSystem, props: NodeProps) {
    super(system, props);

    this.inputs = [new NodeInput(this, ['*'])];

    this.outputs = [];
  }

  compute(inputData: any[]) {
    return inputData[0];
  }
}

class OutputView extends NodeView {
  constructor(node: Node) {
    super(node);

    const d = document.createElement('p');

    node.on('computedData', (data: any) => {
      d.innerHTML = JSON.stringify(data, null, 2);
    });

    this.wrapper.appendChild(d);
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
