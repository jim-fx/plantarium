import type { NodeTypeData } from '../types';
import type { NodeProps, NodeSystemData } from '../types';
import NodeView from '../view/NodeView';
import Node from './Node';
import NodeOutput from './NodeOutput';
import NodeState from './NodeState';
import type NodeSystem from './NodeSystem';
import type NodeType from './NodeType';

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
          const input = n2.getInputs().find(i => i.key === ref.in);
          if (!input)
            throw new Error(
              `Failed ref: from ${n.attributes.name || n.attributes.id} to ${ref.id
              } `,
            );
          n.connectTo(input);
        });
    });

    nodeInstances.forEach((n) => {
      n.enableUpdates = true;
      n.update();
    });

    return nodeInstances;
  }

  parseType(typeData: NodeTypeData): NodeType {
    const { compute, meta, outputs, title: name, parameters = {} } = typeData;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const TempNode = class extends Node {

      outputs = outputs.map(s => new NodeOutput(this, s));

      constructor(system: NodeSystem, props: NodeProps) {
        super(system, props);
        this.meta = meta;
        if (compute) this.compute = compute;

        if (outputs) {
          const _outputs = Array.isArray(outputs) ? outputs : [outputs];
          this.outputs = _outputs.map((s) => new NodeOutput(this, s));
        }

        Object.entries(parameters).forEach(([key, template]) => {
          this.states[key] = new NodeState(this, key, template);
        });
      }
    }

    const inputs = Object.values(parameters)
      .filter((p) => p["internal"] !== true)
      .map((p) => p["type"]);

    if (this.system.options.view) {
      const V = class TempView extends NodeView {
        initView: () => void;
        constructor(node: Node) {
          super(node);
        }
      };

      return {
        ...typeData,
        inputs,
        title: name,
        meta,
        node: TempNode,
        view: V,
      };
    }

    return {
      inputs,
      ...typeData,
      title: name,
      meta,
      node: TempNode,
    };
  }

  getData() {
    return {
      meta: this.system.meta,
      nodes: this.system.nodes.map((n) => n.deserialize()),
    };
  }
}
