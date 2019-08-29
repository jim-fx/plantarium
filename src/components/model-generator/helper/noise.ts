import OpenSimplexNoise from "open-simplex-noise";

let seed = 0;
let noise: OpenSimplexNoise = new OpenSimplexNoise(seed);

export default {
  n1d: (x: number) => {
    return noise.noise2D(x, 0);
  },
  n2d: (x: number, y: number) => {
    return noise.noise2D(x, y);
  },
  n3d: (x: number, y: number, z: number) => {
    return noise.noise3D(x, y, z);
  },
  get seed() {
    return seed;
  },
  set seed(s) {
    seed = s;
    noise = new OpenSimplexNoise(seed);
  }
};
