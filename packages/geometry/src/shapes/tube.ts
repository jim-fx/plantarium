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

  const _pos = Float32Array.from(
    m.position.map((arr) => arr.splice(0, 3)).flat(),
  );
  const index = new Uint16Array(resX * skeleton.length * 3);

  for (let i = 0; i < path.length; i++) {
    const indexOffset = i * resX * 6;
    const positionOffset = i * resX;
    for (let j = 0; j < resX; j++) {
      const _indexOffset = indexOffset + j * 6;
      const _positionOffset = positionOffset + j;

      if (j === resX - 1) {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset - resX + 1;
        index[_indexOffset + 2] = _positionOffset + 1;

        index[_indexOffset + 3] = _positionOffset + 1;
        index[_indexOffset + 4] = _positionOffset + resX;
        index[_indexOffset + 5] = _positionOffset;
      } else if (j + i !== 0) {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset + 1;
        index[_indexOffset + 2] = _positionOffset + resX + 1;

        index[_indexOffset + 3] = _positionOffset + resX + 1;
        index[_indexOffset + 4] = _positionOffset + resX;
        index[_indexOffset + 5] = _positionOffset;
      } else {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset + 1;
        index[_indexOffset + 2] = _positionOffset + resX + 1;

        index[_indexOffset + 5] = _positionOffset + resX + 1;
        index[_indexOffset + 4] = _positionOffset + resX;
        index[_indexOffset + 3] = _positionOffset;
      }
    }
  }

  return {
    position: _pos,
    index,
    normal: new Float32Array(),
    uv: new Float32Array(),
  };
}
