import { noise, interpolateArray } from '@plantarium/geometry';
import { curve } from '@plantarium/helpers';

let lastSettings = '';
let lastCtx;
let currentNoise = 0;

const createContext = (s: PlantariumSettings): GeneratorContext => {
  let seed = 0;
  noise.seed = 0;
  return {
    handleParameter(param: ParameterResult | number = 0, alpha = 0) {
      if (typeof param === 'number') return param;

      let value = param.value || 0;
      let variation = param.variation || 0;

      if (typeof value === 'object') value = this.handleParameter(param, alpha);
      if (typeof variation === 'object')
        variation = this.handleParameter(variation, alpha);

      if ('curve' in param) {
        const v = curve.toArray(param.curve).map((v) => v.y);
        value = interpolateArray(v, alpha);
      }

      if (variation) {
        value +=
          noise.n1d(currentNoise++ * 200) *
          param.variation *
          Math.max(value, 1);
      }

      return value;
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
      currentNoise = 0;
      if (s?.useRandomSeed) {
        seed = Math.floor(Math.random() * 100000);
        noise.seed = seed;
      }
      return;
    },
  };
};

export default (settings: PlantariumSettings): GeneratorContext => {
  const s = JSON.stringify(settings);

  if (s !== lastSettings) {
    lastSettings = s;
    lastCtx = createContext(settings);
  }

  lastCtx.refresh();

  return lastCtx;
};
