import { Vec3 } from "ogl";
import { interpolateArray, draw } from "../helper";
import ring from "./ring";

function mergeRings(rings: Float32Array[], position: Float32Array) {
  let offset = 0;
  const l = rings.length;
  for (let i = 0; i < l; i++) {
    const r = rings[i];
    const _l = r.length;
    for (let j = 0; j < _l; j++) position[offset + j] = r[j];
    offset += _l;
  }
}

export default function(skeleton: Float32Array, diameter: number[], resX: number): TransferGeometry {
  const resY = skeleton.length / 3;

  const numPosition = resY * resX * 3;
  const numIndices = resY * resX * 6 - resX * 6;
  const numUV = resY * resX * 2;

  const position = new Float32Array(numPosition);
  const normal = new Float32Array(numPosition);
  const uv = new Float32Array(numUV);
  const index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);

  const rings = [];

  //Create all rings
  const l = resY;
  for (let i = 0; i < l; i++) {
    const _diameter = interpolateArray(diameter, 1 - i / (l - 1));

    //Current point along line
    const currentPoint = new Vec3(skeleton[i * 3 + 0], skeleton[i * 3 + 1], skeleton[i * 3 + 2]);

    if (i === 0) {
      const _i = 1;

      //Get average of previous segment and next segment
      const avg = new Vec3(
        (currentPoint[0] - skeleton[_i * 3 + 3] - (skeleton[_i * 3 - 3] - currentPoint[0])) / 2,
        (currentPoint[1] - skeleton[_i * 3 + 4] - (skeleton[_i * 3 - 2] - currentPoint[1])) / 2,
        (currentPoint[2] - skeleton[_i * 3 + 5] - (skeleton[_i * 3 - 1] - currentPoint[2])) / 2
      );

      const v2 = new Vec3((skeleton[_i * 3 + 3] - skeleton[_i * 3 - 3]) / 2, (skeleton[_i * 3 + 4] - skeleton[_i * 3 - 2]) / 2, (skeleton[_i * 3 + 5] - skeleton[_i * 3 - 1]) / 2);

      rings[0] = ring(currentPoint, avg, -_diameter, resX, v2);
    } else if (i < l - 1) {
      //Get average of previous segment and next segment
      const avg = new Vec3(
        (currentPoint[0] - skeleton[i * 3 + 3] - (skeleton[i * 3 - 3] - currentPoint[0])) / 2,
        (currentPoint[1] - skeleton[i * 3 + 4] - (skeleton[i * 3 - 2] - currentPoint[1])) / 2,
        (currentPoint[2] - skeleton[i * 3 + 5] - (skeleton[i * 3 - 1] - currentPoint[2])) / 2
      );

      const v2 = new Vec3((skeleton[i * 3 + 3] - skeleton[i * 3 - 3]) / 2, (skeleton[i * 3 + 4] - skeleton[i * 3 - 2]) / 2, (skeleton[i * 3 + 5] - skeleton[i * 3 - 1]) / 2);

      rings[i] = ring(currentPoint, avg, _diameter, resX, v2);
    } else {
      const prevSegment = new Vec3(currentPoint[0] - skeleton[i * 3 - 3], currentPoint[1] - skeleton[i * 3 - 2], currentPoint[2] - skeleton[i * 3 - 1]);
      rings[i] = ring(currentPoint, prevSegment, _diameter, resX);
    }
  }

  mergeRings(rings, position);

  //Create the indeces
  for (let i = 0; i < resY; i++) {
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
      } else {
        index[_indexOffset + 0] = _positionOffset;
        index[_indexOffset + 1] = _positionOffset + 1;
        index[_indexOffset + 2] = _positionOffset + resX + 1;

        index[_indexOffset + 3] = _positionOffset + resX + 1;
        index[_indexOffset + 4] = _positionOffset + resX;
        index[_indexOffset + 5] = _positionOffset;
      }
    }
  }

  return {
    position,
    normal,
    uv,
    index
  };
}
