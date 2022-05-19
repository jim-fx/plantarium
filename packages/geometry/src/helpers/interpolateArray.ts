import lerp from './lerp';

export default function interpolateArray(array: number[], alpha = 0): number {
  //Clamp to 0-1 range
  //alpha = Math.max(Math.min(alpha, 1), 0);

  const _alpha = (array.length - 1) * alpha;

  //Get value below and above i
  const i = Math.floor(_alpha);
  const j = Math.ceil(_alpha);

  //Lerp the two values
  return lerp(array[j], array[i], j - _alpha);
}
;
