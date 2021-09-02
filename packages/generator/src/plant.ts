import {
  convertInstancedGeometry,
  join
} from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import createContext from './createContext';
import { walkGeometryNode, walkSkeletonNode } from './walkNode';

const log = logger('gen.plant');

export default function plant(
  rootNode: NodeResult,
  s: Partial<PlantariumSettings>,
) {
  log('-------- ~generator started~ --------');

  const a = performance.now();

  const ctx = createContext(s);

  const skelly = walkSkeletonNode(rootNode, ctx);

  log('final skeleton', skelly.result);

  const final = walkGeometryNode(skelly, ctx);

  log('final geometry', final);

  const { result } = final;

  //result.geometry = calculateNormals(result.geometry);

  if (result.instances) {
    const instances = result.instances
      ?.map((i) => convertInstancedGeometry(i))
      .flat();

    result.geometry = join(result.geometry, ...instances);
  }

  log('generated in ', Math.floor((performance.now() - a) * 10) / 10, 'ms');

  return result;
}
