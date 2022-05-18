import { mat4, vec3, type ReadonlyVec3 } from "gl-matrix";
import insertArray from "./insertArray";

const { identity, rotate } = mat4;
const { add, cross, dot, mul, normalize, subtract, transformMat4 } = vec3;

function createCircle(res: number) {
  const angle = (2 * Math.PI) / res;

  return new Array(res).fill(null).map((_, i) => {
    return [Math.cos(angle * i), Math.sin(angle * i)];
  });
}

function createIndeces(resX: number, stemLength = 1) {
  const index = new Uint16Array(resX * (Math.max(stemLength, 1) - 1) * 6);

  for (let i = 0; i < stemLength; i++) {
    const indexOffset = i * resX * 6;
    const positionOffset = i * resX;
    for (let j = 0; j < resX; j++) {
      const _indexOffset = indexOffset + j * 6;
      const _positionOffset = positionOffset + j;

      index[_indexOffset + 0] = _positionOffset;
      index[_indexOffset + 1] = _positionOffset - resX + 1;
      index[_indexOffset + 2] = _positionOffset + 1;

      index[_indexOffset + 3] = _positionOffset + 1;
      index[_indexOffset + 4] = _positionOffset + resX;
      index[_indexOffset + 5] = _positionOffset;

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

  return index;
}

export default function(path: Float32Array, resolution = 3) {
  const mat = [] as unknown as mat4,
    v = [] as unknown as vec3,
    axis = [] as unknown as vec3;

  const pointAmount = path.length / 4;
  const positionAmount = pointAmount * resolution;

  const position = new Float32Array(positionAmount * 3);
  const normal = new Float32Array(positionAmount * 3);
  const uv = new Float32Array(positionAmount * 2);
  const index = createIndeces(resolution, pointAmount);

  const circlePositions = createCircle(resolution);

  for (let i = 0; i < pointAmount; i++) {

    const n = [0, 0, 1] as unknown as vec3;
    const currentPoint = path.slice(i * 4, i * 4 + 3) as ReadonlyVec3;
    const nextPoint = path.slice((i + 1) * 4, (i + 1) * 4 + 3) as ReadonlyVec3;
    const previousPoint = path.slice((i - 1) * 4, (i - 1) * 4 + 3) as ReadonlyVec3;
    const thicc = path[i * 4 + 3];

    if (i === 0) {
      subtract(v, currentPoint, nextPoint);
    } else if (i === pointAmount - 1) {
      subtract(v, previousPoint, currentPoint);
    } else {
      subtract(v, previousPoint, nextPoint);
    }
    normalize(v, v);
    cross(axis, n, v);
    const angle = Math.acos(dot(n, v));
    identity(mat);
    rotate(mat, mat, angle, axis);

    for (let j = 0; j < resolution; j++) {
      const pt = [...circlePositions[j], 0] as unknown as vec3;
      mul(pt, pt, [thicc, thicc, 1]);
      transformMat4(pt, pt, mat);
      const n = [] as unknown as vec3;
      normalize(n, pt)
      const offset = i * resolution * 3 + j * 3;
      insertArray(normal, offset, n as number[])
      mul(n, n, [-1, -1, -1]);
      add(pt, pt, currentPoint);
      insertArray(position, offset, pt as number[])
      insertArray(uv, i * resolution * 2 + j * 2, [j / resolution, i / pointAmount])
    }
  }

  return {
    position,
    normal,
    uv,
    index
  };
}
