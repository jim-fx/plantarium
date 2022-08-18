import type { Project } from "@plantarium/types";
import nodeMap from "./nodeMap";
import type { WrappedNode } from "./types";

import createContext from "./context";
export type GeneratorContext = ReturnType<typeof createGeneratorContext>;

export default function createGeneratorContext({ nodes: _nodes }: Project, settings: Partial<PlantariumSettings>) {
  const ctx = createContext(settings);

  globalThis["ctx"] = ctx;

  const timings: Record<string, { amount: number, time: number }> = {};

  const nodeIdMap = new Map<string, WrappedNode>();
  const nodeRefMap = new Map<string, { n: WrappedNode, in: string, out: number }[]>();

  const getNodeRef = (id: string) => nodeRefMap.get(id) ?? []
  const getNode = (id: string) => nodeIdMap.get(id) ?? []

  const nodes = [];

  // Create a wrapper objects for all of our nodes
  for (const { attributes, state } of _nodes) {
    const exec = nodeMap.get(attributes.type)
    if (!exec) {
      return {
        errors: ["Missing NodeType " + attributes.type]
      };
    }
    nodes.push({
      attributes,
      state,
      exec,
      type: attributes.type,
      id: attributes.id,
      level: -1,
      results: []
    })
  }

  let outputNode: WrappedNode;

  nodes.forEach(n => {
    nodeIdMap.set(n.id, n);

    if (!outputNode && n.type === "output") {
      outputNode = n
      outputNode.level = 0;
    }

    n.attributes?.refs?.forEach(r => {
      if (nodeRefMap.has(r.id)) {
        nodeRefMap.set(r.id, [...nodeRefMap.get(r.id), { n, in: r.in, out: r.out }])
      } else {
        nodeRefMap.set(r.id, [{ n, in: r.in, out: r.out }])
      }
    })
  })

  if (!outputNode) {
    return {
      errors: ["Missing output node"]
    }
  }

  function getBucketsForNode(n: WrappedNode) {
    if (n?.buckets) return n.buckets;


    const backlog: WrappedNode[] = [n];
    const processedNodes: WrappedNode[] = [n]

    while (backlog.length) {

      const node = backlog.shift();

      // If there are any nodes which are connected to the input of this node
      const inputNodes = getNodeRef(node.id);
      if (inputNodes?.length) {

        for (const { n: inputNode } of inputNodes) {

          inputNode.level = node.level + 1;

          if (!processedNodes.includes(inputNode)) {
            processedNodes.push(inputNode)
          }

          backlog.push(inputNode)
        }
      }
    }

    const nodeBuckets: WrappedNode[][] = [];
    for (const n of processedNodes) {
      if (nodeBuckets[n.level]) {
        nodeBuckets[n.level].push(n)
      } else {
        nodeBuckets[n.level] = [n]
      }
    }

    n.buckets = nodeBuckets;

    return nodeBuckets;

  }

  function constructParametersForNode(n: WrappedNode) {

    if ("parameters" in n) {
      return n.parameters
    };

    const parameters = {};

    const execNode = nodeMap.get(n.type);

    for (const input of getNodeRef(n.id)) {
      const inputNode = input.n;
      if (inputNode.exec.outputs[0] === "plant") {
        parameters[input.in] = () => {
          return input.n.results[0]
        }
      } else {
        if (inputNode.exec?.compute) {
          parameters[input.in] = (alpha: number) => {
            const parameters = constructParametersForNode(input.n);
            if (!(inputNode.id in timings)) timings[inputNode.id] = { time: 0, amount: 0 };
            const a = performance.now();
            const res = inputNode.exec.compute(parameters, ctx, alpha)
            timings[inputNode.id].time += performance.now() - a;
            timings[inputNode.id].amount++;
            return res;
          }
        } else {
          parameters[input.in] = (alpha: number) => {
            const obj = {};
            const parameters = constructParametersForNode(input.n);
            const keys = Object.keys(parameters)
            keys.forEach(k => {
              obj[k] = parameters[k](alpha)
            })
            return obj;
          }
        }
      }
    }


    // Check if required paramaters are missing
    for (const key of Object.keys(execNode.parameters)) {
      if (execNode.parameters[key]?.internal) {
        parameters[key] = n.state[key]
      } else if (parameters[key] === undefined) {
        if (execNode.parameters[key]?.required) {
          if (parameters[key] === undefined) {
            return {
              errors: [{ id: n.id, err: `Missing Input <b>${execNode.parameters[key]?.label || key}</b>` }]
            };
          }
        }
        parameters[key] = () => n.state[key];

      }
    }

    n.parameters = parameters;

    return parameters;

  }

  return {
    nodes,
    outputNode,
    getNodeRef,
    timings,
    getNode,
    getBucketsForNode,
    constructParametersForNode,
    ctx
  }

}
