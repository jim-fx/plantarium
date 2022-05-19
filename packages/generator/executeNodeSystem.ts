import nodeMap from "./nodeMap";
import createGeneratorContext from "./generatorContext";
import { tube, join, convertInstancedGeometry, calculateNormals, sanityCheckGeometry } from "@plantarium/geometry";
import { PlantProject, PlantariumSettings } from "@plantarium/types";


export async function executeNodeSystem(project: PlantProject, settings: Partial<PlantariumSettings>) {


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

        if (execNode?.computeStem) {
          ctx["_id"] = n.id;
          const result = execNode.computeStem(parameters, ctx);
          if (!caughtNaN && result.stems.find(s => s.skeleton.includes(NaN))) {
            console.warn("Node " + execNode.type + " produced NaN in skeleton");
            console.log({ result })
          }
          n.results = Array.isArray(result) ? result : [result];
        }

        if (execNode?.computeGeometry) {
          const result = execNode.computeGeometry(parameters, n.results[0], ctx);
          n.results[0] = { ...n.results[0], ...result };
        }


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
    sanityCheckGeometry(geometry)
    const _instances = instances
      ?.map((i) => convertInstancedGeometry(i))
      .flat()
    geometry = join(geometry, ..._instances);
    sanityCheckGeometry(geometry)
  }


  return {
    stems,
    geometry: calculateNormals(geometry)
  };

}
