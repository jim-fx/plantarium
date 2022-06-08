import { length2D, length3D } from './length';

export function normalize2D([x, y]: number[]) {
  const l = length2D([x, y]);

  if (l === 0) {
    return [1, 0];
  }

  return [x / l, y / l];
};



export function normalize3D([x, y, z]: number[]): [number, number, number] {
  const l = length3D([x, y, z]);
  return [x / l, y / l, z / l];
};
