import { noise } from "../helpers";

export function noiseSkeleton(
  skeleton: Float32Array,
  strength = 1,
  scale: [number, number, number] | number = 1,
  offset: [number, number, number] | number = 0,
  fixateBottom = false
) {

  const _s = Array.isArray(scale) ? 1 : scale;
  const scaleX = scale[0] ?? _s;
  const scaleY = scale[1] ?? _s;
  const scaleZ = scale[2] ?? _s;

  const _o = Array.isArray(offset) ? 0 : offset;
  const offsetX = offset[0] ?? _o;
  const offsetY = offset[1] ?? _o;
  const offsetZ = offset[2] ?? _o;

  const pathLength = skeleton.length / 4;

  const lastVec = [skeleton[0], skeleton[1], skeleton[2]];
  let distance = 0;

  for (let i = 0; i < pathLength; i++) {
    const a = i / pathLength;

    distance +=
      (Math.abs(lastVec[0] - skeleton[i * 4 + 0]) +
        Math.abs(lastVec[1] - skeleton[i * 4 + 1]) +
        Math.abs(lastVec[2] - skeleton[i * 4 + 2])) /
      3;

    lastVec[0] = skeleton[i * 4 + 0];
    lastVec[1] = skeleton[i * 4 + 1];
    lastVec[2] = skeleton[i * 4 + 2];

    const _s = fixateBottom ? (strength * a) : strength;

    const [x, y, z] = skeleton.slice(i * 4, i * 4 + 3)

    skeleton[i * 4 + 0] = x +
      noise.n3d(x, y, z) * _s;
    skeleton[i * 4 + 1] = y +
      noise.n3d(y, z, x) * _s;
    skeleton[i * 4 + 2] = z +
      noise.n3d(z, x, y) * _s;
  }

  return skeleton;

}
