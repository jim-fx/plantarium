import lerp from "./lerp";

function interpolateArray(array: number[], alpha: number = 0): number {
  //Clamp to 0-1 range
  alpha = Math.max(Math.min(alpha, 1), 0);

  const length = array.length;

  //Get value below and above i
  const i = Math.max(Math.min(Math.floor(length * alpha), length - 2), 0);
  const j = Math.max(Math.min(Math.ceil(length * alpha), length - 1), 0);

  //Lerp the two values
  return lerp(array[j], array[i], j - alpha * (length - 1));
}

export default interpolateArray;
