import lerp from "./lerp";

export default function(skeleton: Float32Array, alpha: number): number[] {
  //Clamp to 0-1 range
  alpha = Math.max(Math.min(alpha, 1), 0);

  const amountPoints = skeleton.length / 3;

  //Get value below and above i
  const i = Math.max(Math.min(Math.floor(amountPoints * alpha), amountPoints - 2), 0);
  const j = Math.max(Math.min(Math.ceil(amountPoints * alpha), amountPoints - 1), 0);

  const a = j - alpha * (amountPoints);

  return [
    lerp(skeleton[j * 3 + 0], skeleton[i * 3 + 0], a),
    lerp(skeleton[j * 3 + 1], skeleton[i * 3 + 1], a),
    lerp(skeleton[j * 3 + 2], skeleton[i * 3 + 2], a)
  ];
}
