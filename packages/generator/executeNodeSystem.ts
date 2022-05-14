import nodeMap from "./nodeMap";
import createGeneratorContext from "./generatorContext";
import { tube, join, convertInstancedGeometry, calculateNormals } from "@plantarium/geometry";


export async function executeNodeSystem(project: PlantProject, settings: PlantariumSettings) {


  const gctx = createGeneratorContext(project, settings);

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

        let parameters = gctx.constructParametersForNode(n)

        if (execNode?.computeStem) {
          ctx["_id"] = n.id;
          const result = execNode.computeStem(parameters, ctx);
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


  // Now we can start executing buckets
  // for (const bucket of nodeBuckets.reverse()) {
  //   for (const n of bucket) {
  //     const execNode = nodeMap.get(n.type);
  //     if (execNode) {
  //
  //       let parameters = gctx.constructParametersForNode(n)
  //
  //  
  //     } else {
  //       console.warn("Missing Type", n.type)
  //       console.log(nodeMap)
  //     }
  //   }
  // }
  //


  const { stems, instances } = gctx.outputNode.paramaters.input();

  let geometry = join(...stems.map(s => tube(s.skeleton, ctx.getSetting("stemResX"))));

  if (instances) {
    const _instances = instances
      ?.map((i) => convertInstancedGeometry(i))
      .flat();

    geometry = join(geometry, ..._instances);
  }


  return {
    stems,
    geometry: calculateNormals(geometry)
  };

}
