import lerp from './lerp';

export default function (skeleton: Float32Array, alpha: number): number[] {
  //alpha = Math.max(Math.min(alpha, 1), 0);

  const _alpha = (skeleton.length / 4 - 1) * alpha;

  const i = Math.floor(_alpha);
  const j = Math.ceil(_alpha);

  const a = j - _alpha;

  return [
    lerp(skeleton[j * 4 + 0], skeleton[i * 4 + 0], a),
    lerp(skeleton[j * 4 + 1], skeleton[i * 4 + 1], a),
    lerp(skeleton[j * 4 + 2], skeleton[i * 4 + 2], a),
  ];
}
