import nodeMap from "./nodeMap";
import type { WrappedNode } from "./types";

import createContext from "./context"
export type GeneratorContext = ReturnType<typeof createGeneratorContext>;

export default function createGeneratorContext({ nodes: _nodes }: PlantProject, settings: Partial<PlantariumSettings>) {


  const ctx = createContext(settings);

  const nodeIdMap = new Map<string, WrappedNode>();
  const nodeRefMap = new Map<string, { n: WrappedNode, in: string, out: number }[]>();

  const getNodeRef = (id: string) => nodeRefMap.get(id) ?? []
  const getNode = (id: string) => nodeIdMap.get(id) ?? []

  const nodes = _nodes.map(({ attributes, state }) => {
    return {
      attributes,
      state,
      // For some reason sometimes the type is upper case, no idea why/how/when that happens
      type: attributes.type.toLowerCase(),
      id: attributes.id,
      level: -1,
      results: []
    }
  })

  let outputNode: WrappedNode;

  nodes.forEach(n => {
    nodeIdMap.set(n.id, n);

    if (!outputNode && n.type === "output") {
      outputNode = n
      outputNode.level = 0;
    }

    n.attributes.refs.forEach(r => {
      if (nodeRefMap.has(r.id)) {
        nodeRefMap.set(r.id, [...nodeRefMap.get(r.id), { n, in: r.in, out: r.out }])
      } else {
        nodeRefMap.set(r.id, [{ n, in: r.in, out: r.out }])
      }
    })
  })

  function getBucketsForNode(n: WrappedNode) {
    if (n?.buckets) return n.buckets;


    let backlog: WrappedNode[] = [n];
    let processedNodes: WrappedNode[] = [n]

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

    if (n.paramaters) return n.paramaters;

    let parameters = {};

    const execNode = nodeMap.get(n.type);

    for (const [key, value] of Object.entries(n.state)) {
      if (execNode.parameters[key]?.internal) {
        parameters[key] = value;
      } else {
        parameters[key] = () => value;
      }
    }

    for (const input of getNodeRef(n.id)) {
      const execInputNode = nodeMap.get(input.n.type)
      if (execInputNode.outputs[0] === "plant") {
        parameters[input.in] = () => {
          return input.n.results[0]
        }
      } else {
        if (execInputNode?.computeValue) {
          parameters[input.in] = (alpha = 1) => {
            const parameters = constructParametersForNode(input.n);
            return execInputNode.computeValue(parameters, ctx, alpha)
          }
        } else {
          parameters[input.in] = (alpha = 1) => {
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

    n.paramaters = parameters;

    return parameters;

  }

  return {
    nodes,
    outputNode,
    getNodeRef,
    getNode,
    getBucketsForNode,
    constructParametersForNode,
    ctx
  }

}
