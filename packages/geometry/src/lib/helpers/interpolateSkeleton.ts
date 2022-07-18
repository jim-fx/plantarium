import { lerp4D } from './lerp';

export default function(
  skeleton: Float32Array,
  alpha: number,
): [number, number, number, number] {

  const _alpha = (skeleton.length / 4) * Math.max(Math.min(alpha, 0.9999), 0.0001);

  const j = Math.min(Math.ceil(_alpha), skeleton.length / 4 - 1);
  const i = Math.max(Math.floor(_alpha), 0);

  const a = j - _alpha;

  return lerp4D(skeleton.slice(j * 4, j * 4 + 4), skeleton.slice(i * 4, i * 4 + 4), a);

}
