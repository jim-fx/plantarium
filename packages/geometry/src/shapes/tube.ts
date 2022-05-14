import { groupArray } from '../../../helpers/src';
import { extrudePath } from '../helpers';

export default function(skeleton: Float32Array, resX = 8): TransferGeometry {
  // Skeleton
  // [x,y,z,t,x,y,z,t];

  // skeleton = Float32Array.from([0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0]);

  //Transform the skeleton into the path
  // from [x,y,z,t,x,y,z,t]
  // to [[x,y,z,t],[x,y,z,t]]
  const path = groupArray(skeleton, 4) as [number, number, number, number][];

  const m = extrudePath(path, resX);

  const position = Float32Array.from(
    m.position.flat(),
  );

  const normal = Float32Array.from(
    m.normals.flat(),
  );


  return {
    position,
    index: m.index,
    normal,
    uv: new Float32Array(),
  };
}
