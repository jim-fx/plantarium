import { Vec3 } from "ogl";
import interpolateArray from "../helper/interpolateArray";
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
  const numIndices = (resY + 1) * resX * 12;
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
      const axis = new Vec3(0, 1, 0);
      rings[i] = ring(currentPoint, axis, _diameter, resX);
    } else if (i < l - 1) {
      //Get average of previous segment and next segment
      const avg = new Vec3(
        (currentPoint[0] - skeleton[i * 3 - 3] + skeleton[i * 3 + 3] - currentPoint[0]) / 2,
        (currentPoint[1] - skeleton[i * 3 - 2] + skeleton[i * 3 + 4] - currentPoint[1]) / 2,
        (currentPoint[2] - skeleton[i * 3 - 1] + skeleton[i * 3 + 5] - currentPoint[2]) / 2
      );
      rings[i] = ring(currentPoint, avg, _diameter, resX);
    } else {
      const prevSegment = new Vec3(currentPoint[0] - skeleton[i * 3 - 3], currentPoint[1] - skeleton[i * 3 - 2], currentPoint[2] - skeleton[i * 3 - 1]);
      rings[i] = ring(currentPoint, prevSegment, _diameter, resX);
    }
  }

  mergeRings(rings, position);

  //Create the indeces
  const segmentAmount = resY - 1;
  const facesPerSegment = resX;

  let offset = 0;
  for (let i = 0; i < segmentAmount; i++) {
    for (let j = 0; j < facesPerSegment; j++) {
      const _o = offset * 6;

      index[_o + 0] = offset;
      index[_o + 1] = offset + 1;
      index[_o + 2] = offset + resX;

      index[_o + 3] = offset + 1;
      index[_o + 4] = offset + resX + 1;
      index[_o + 5] = offset + resX;

      offset += 1;
    }

    //Fix last triangle in segment
    index[(offset - 1) * 6 + 1] -= resX;
    index[(offset - 1) * 6 + 3] -= resX;
    index[(offset - 1) * 6 + 4] -= resX;
  }

  return {
    position,
    normal,
    uv,
    index
  };
}
