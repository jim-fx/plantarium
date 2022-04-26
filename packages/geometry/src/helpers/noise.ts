import * as n from 'open-simplex-noise';

const noise = n?.default ?? n;

console.log({ noise })

let seed = 0;
let noise2D = noise.makeNoise2D(seed);
let noise3D = noise.makeNoise3D(seed);

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
    noise2D = noise.makeNoise2D(seed);
    noise3D = noise.makeNoise3D(seed);
  },
};
