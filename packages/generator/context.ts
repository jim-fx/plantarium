import { noise } from '@plantarium/geometry';

let lastSettings = '';
let lastCtx: NodeContext;
let currentNoise = 2;

export type NodeContext = ReturnType<typeof createContext>;

const createContext = (s: Partial<PlantariumSettings>) => {
  let seed = 0;
  noise.seed = 0;

  let debug = {
    vec3: [],
    point: []
  }

  return {
    _id: "",
    getId() {
      return this._id;
    },
    n1d(scale: number) {
      return noise.n1d(currentNoise++ * scale);
    },
    n1dn(scale: number) {
      return 0.5 + noise.n1d(currentNoise++ * scale) / 2;
    },
    getSetting(key: string) {
      return s[key];
    },
    get settings() {
      return s;
    },
    debugVec3(vec: number[], origin = [0, 0, 0], h = 0) {
      debug.vec3.push(vec[0], vec[1], vec[2], origin[0], origin[1], origin[2], h)
    },
    debugPoint3(vec: number[]) {
      debug.point.push(vec[0], vec[1], vec[2]);
    },
    getDebug() {
      return debug
    },
    get seed() {
      return seed;
    },
    refresh() {
      debug = {
        vec3: [],
        point: []
      }
      currentNoise = 2;
      if (s?.seed?.value) {
        seed = Math.floor(s?.seed?.value);
      }
      if (s?.seed?.useRandom) {
        seed = Math.floor(Math.random() * 100000);
      }
      noise.seed = seed;
      return;
    },
  };
};

export default (settings: Partial<PlantariumSettings>): NodeContext => {
  const s = JSON.stringify(settings);

  if (s !== lastSettings) {
    lastSettings = s;
    lastCtx = createContext(settings);
  }

  lastCtx.refresh();

  return lastCtx;
}
