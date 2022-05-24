import { noise } from '@plantarium/geometry';

let lastSettings = '';
let lastCtx: NodeContext;
let currentNoise = 2;

export type NodeContext = ReturnType<typeof createContext>;

const createContext = (s: Partial<PlantariumSettings>) => {
  let seed = 0;
  noise.seed = 0;
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
    get seed() {
      return seed;
    },
    refresh() {
      currentNoise = 2;
      if (s?.useRandomSeed) {
        seed = Math.floor(Math.random() * 100000);
        noise.seed = seed;
      }
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
