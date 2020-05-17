import Node from './Node';
import NodeView from 'view/NodeView';
import NodeOutput from './NodeOutput';
import NodeSystem from './NodeSystem';
import NodeType from './NodeType';
import NodeState from './NodeState';

export default class NodeParser {
  system: NodeSystem;

  constructor(system: NodeSystem) {
    this.system = system;
  }

  parseSystem(nodeData: NodeSystemData) {
    const { nodes } = nodeData;

    const nodeStore = new Map<string, Node>();

    // Instantiate all the nodes
    const nodeInstances = nodes.map((props) => {
      const n = this.system.factory.create(props);
      n.enableUpdates = false;
      nodeStore.set(n.id, n);
      return n;
    });

    // Connect all the nodes
    nodeInstances.forEach((n) => {
      if (n.attributes.refs)
        n.attributes.refs.forEach((ref) => {
          const n2 = nodeStore.get(ref.id);
          if (!n2)
            throw new Error(
              `Failed ref: from ${n.attributes.name || n.attributes.id} to ${
                ref.id
              } `,
            );
          n.connectTo(n2, ref.in);
        });
    });

    nodeInstances.forEach((n) => {
      n.enableUpdates = true;
      n.update();
    });

    return nodeInstances;
  }

  parseType(typeData: NodeTypeData): NodeType {
    const { compute, meta, outputs, name, state, initView } = typeData;

    const inputs = [];

    const N = class TempNode extends Node {
      constructor(system: NodeSystem, props: NodeProps) {
        super(system, props);
        if (compute) this.compute = compute;
        if (outputs)
          this.outputs = outputs.map((type) => new NodeOutput(this, type));
        if (state) {
          Object.entries(state).forEach(([key, value]) => {
            this.states.push(new NodeState(this, key, value));
          });
        }
      }
    };

    if (this.system.options.view) {
      const V = class TempView extends NodeView {
        initView: () => void;
        constructor(node: Node) {
          super(node);
          this.initView = () => initView && initView(node);
          this.initView();
        }
      };

      return {
        name,
        meta,
        inputs,
        outputs,
        node: N,
        view: V,
      };
    }

    return {
      name,
      meta,
      inputs,
      outputs,
      node: N,
    };
  }

  getData() {
    return {
      meta: this.system.meta,
      nodes: this.system.nodes.map((n) => n.deserialize()),
    };
  }
}
