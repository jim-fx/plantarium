import { calculateNormals, convertInstancedGeometry, join, tube } from "@plantarium/geometry";
import { InstancedGeometry, PlantariumSettings, PlantStem, Project } from "@plantarium/types";
import createGeneratorContext from "./generatorContext";
import nodeMap from "./nodeMap";


export async function executeNodeSystem(project: Project, settings: Partial<PlantariumSettings>) {


  const startTime = performance.now();

  const gctx = createGeneratorContext(project, settings);

  if (gctx.errors) {
    return {
      errors: gctx.errors
    }
  }


  const ctx = gctx.ctx;

  /*
   * Here we sort the nodes into buckets, which we then execute one by one
   * +-b2-+-b1-+---b0---+
   * |    |    |        |
   * | n3 | n2 | Output |
   * | n6 | n4 | Level  |
   * |    | n5 |        |
   * |    |    |        |
   * +----+----+--------+
   */

  const nodeBuckets = gctx.getBucketsForNode(gctx.outputNode);

  // Now we can start executing buckets
  for (const bucket of nodeBuckets.reverse()) {
    for (const n of bucket) {
      const execNode = nodeMap.get(n.type);
      if (execNode) {

        const parameters = gctx.constructParametersForNode(n)

        if (parameters?.errors) {
          return { errors: parameters.errors }
        }

        const aStem = performance.now();

        if (execNode?.compute) {
          ctx["_id"] = n.id;
          const result = execNode.compute(parameters, ctx);
          if (result?.stems?.find(s => s.skeleton.includes(NaN))) {
            console.warn("Node " + execNode.type + " produced NaN in skeleton");
            console.log({ result })
          }
          n.results = Array.isArray(result) ? result : [result];
        }
        if (!(n.id in gctx.timings)) gctx.timings[n.id] = { time: performance.now() - aStem, amount: 0 };

        gctx.timings[n.id].time += performance.now() - aStem;
        gctx.timings[n.id].amount++;


      } else {
        console.warn("Missing Type", n.type)
        console.log(nodeMap)
      }
    }
  }

  if (!gctx?.outputNode?.parameters?.input) {
    return {
      errors: ["Missing input connection to output node"]
    }
  }

  const res = gctx.outputNode.parameters.input();
  if (!res) {
    return {
      errors: ["DUnno?"]
    }
  }

  const { stems, instances } = res as { stems: PlantStem[], instances: InstancedGeometry[] };

  const geometries = stems.map(s => tube(s.skeleton, ctx.getSetting("stemResX")));

  const ids = stems.map(s => s.id);

  if (instances) {
    const _instances = instances
      ?.map((i) => convertInstancedGeometry(i))
      .flat()
    geometries.push(..._instances);
    ids.push(...instances.map(i => i.id));
  }

  gctx.timings["global"] = { time: performance.now() - startTime, amount: 1 };

  return {
    stems,
    debug: gctx.ctx.getDebug(),
    timings: gctx.timings,
    geometry: calculateNormals(join(...geometries)),
    ids,
    geometries
  };

}
