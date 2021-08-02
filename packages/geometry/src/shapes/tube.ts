import { groupArray } from '../../../helpers/src';
import { extrudePath } from '../helpers';

export default function (skeleton: Float32Array, resX = 8): TransferGeometry {
  // Skeleton
  // [x,y,z,t,x,y,z,t];

  // skeleton = Float32Array.from([0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 0, 0]);

  //Transform the skeleton into the path
  // from [x,y,z,t,x,y,z,t]
  // to [[x,y,z,t],[x,y,z,t]]
  const path = groupArray(skeleton, 4);

  const m = extrudePath(path, resX);
  console.log(m);
  const _pos = Float32Array.from(
    m.position.map((arr) => arr.splice(0, 3)).flat(),
  );
  const _ind = Uint16Array.from(m.index.flat());

  return {
    position: _pos,
    index: _ind,
    normal: new Float32Array(),
    uv: new Float32Array(),
  };
}
