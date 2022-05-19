export default function(
  skeleton: Float32Array,
  alpha: number,
): [number, number, number, number] {
  const _alpha = (skeleton.length / 4) * Math.max(Math.min(alpha, 0.9999), 0.0001);

  const i = Math.max(Math.floor(_alpha), 0);
  const j = Math.min(Math.ceil(_alpha), skeleton.length / 4 - 1);

  return [
    skeleton[j * 4 + 0] - skeleton[i * 4 + 0],
    skeleton[j * 4 + 1] - skeleton[i * 4 + 1],
    skeleton[j * 4 + 2] - skeleton[i * 4 + 2],
    skeleton[j * 4 + 3] + skeleton[i * 4 + 3] / 2,
  ];
}
