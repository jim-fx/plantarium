export default function(
  skeleton: Float32Array,
  alpha: number,
): [number, number, number, number] {
  const _alpha = (skeleton.length / 4 - 1) * Math.max(Math.min(alpha, 1), 0);

  const i = Math.floor(_alpha);
  const j = Math.ceil(_alpha);

  // TODO: we could make this more precise by lerping between the next and the previous vector base on alpha

  return [
    skeleton[j * 4 + 0] - skeleton[i * 4 + 0],
    skeleton[j * 4 + 1] - skeleton[i * 4 + 1],
    skeleton[j * 4 + 2] - skeleton[i * 4 + 2],
    skeleton[j * 4 + 3] + skeleton[i * 4 + 3] / 2,
  ];
}
