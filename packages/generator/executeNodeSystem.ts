import nodeMap from "./nodeMap";
import createGeneratorContext from "./generatorContext";
import { tube, join, convertInstancedGeometry, calculateNormals, sanityCheckGeometry } from "@plantarium/geometry";
import { PlantProject, PlantariumSettings } from "@plantarium/types";


export async function executeNodeSystem(project: PlantProject, settings: Partial<PlantariumSettings>) {


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

  let caughtNaN = false;

  // Now we can start executing buckets
  for (const bucket of nodeBuckets.reverse()) {
    for (const n of bucket) {
      const execNode = nodeMap.get(n.type);
      if (execNode) {

        let parameters = gctx.constructParametersForNode(n)

        if (parameters?.errors) {
          return { errors: parameters.errors }
        }

        let aStem = performance.now();

        if (execNode?.compute) {
          ctx["_id"] = n.id;
          const result = execNode.compute(parameters, ctx);
          if (!caughtNaN && result?.stems?.find(s => s.skeleton.includes(NaN))) {
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

  const { stems, instances } = res;


  let geometry = join(...stems.map(s => tube(s.skeleton, ctx.getSetting("stemResX"))));

  if (instances) {
    const _instances = instances
      ?.map((i) => convertInstancedGeometry(i))
      .flat()
    geometry = join(geometry, ..._instances);
  }

  gctx.timings["global"] = performance.now() - startTime;


  return {
    stems,
    debug: gctx.ctx.getDebug(),
    timings: gctx.timings,
    geometry: calculateNormals(geometry)
  };

}
