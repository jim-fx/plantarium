import { makeNoise2D, makeNoise3D } from 'open-simplex-noise';



let seed = 0;
let noise2D = makeNoise2D(seed);
let noise3D = makeNoise3D(seed);

export default {
  n1d: (x: number) => {
    return noise2D(x, 0);
  },
  n2d: (x: number, y: number) => {
    return noise2D(x, y);
  },
  n3d: (x: number, y: number, z: number) => {
    return noise3D(x, y, z);
  },
  get seed() {
    return seed;
  },
  set seed(s) {
    if (s === seed) return;
    seed = s;
    noise2D = makeNoise2D(seed);
    noise3D = makeNoise3D(seed);
  },
};
