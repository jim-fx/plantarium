function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}

function interpolateArray(array: number[], alpha: number): number {
  //Clamp to 0-1 range
  alpha = Math.max(Math.min(alpha, 1), 0);

  //Get value below and above i
  const i = Math.max(Math.min(Math.floor(array.length * alpha), array.length - 2), 0);
  const j = Math.max(Math.min(Math.ceil(array.length * alpha), array.length - 1), 0);

  //Lerp the two values
  return lerp(array[i], array[j], alpha - i / array.length);
}

export default interpolateArray;
