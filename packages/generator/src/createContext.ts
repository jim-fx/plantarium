import { noise } from '@plantarium/geometry';
import isNode from './helpers/isNode';
import uniqID from './helpers/uniqID';
import { walkValueNode } from './walkNode';

let lastSettings = '';
let lastCtx;
let currentNoise = 2;

const createContext = (s: Partial<PlantariumSettings>): GeneratorContext => {
  let seed = 0;
  noise.seed = 0;
  let buildId = uniqID();
  return {
    handleParameter(param: ParameterResult | GeneratorContextNode, alpha = 1) {
      if (typeof param === 'number') return param;

      // Handle if parameter is node
      if (isNode(param)) {
        return walkValueNode(param, this, alpha);
      }

      // If we are here its probably a vector
      console.log('Heeere', param);
      return param;
    },
    n1d(scale: number) {
      return noise.n1d(currentNoise++ * scale);
    },
    n1dn(scale: number) {
      return 1 + noise.n1d(currentNoise++ * scale) / 2;
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
      buildId = uniqID();
      return;
    },
  };
};

export default (settings: Partial<PlantariumSettings>): GeneratorContext => {
  const s = JSON.stringify(settings);

  if (s !== lastSettings) {
    lastSettings = s;
    lastCtx = createContext(settings);
  }

  lastCtx.refresh();

  return lastCtx;
};
