import { interpolateArray, noise } from '@plantarium/geometry';
import { curve } from '@plantarium/helpers';

let lastSettings = '';
let lastCtx;
let currentNoise = 0;

const uniqID = (() => {
  let id = Math.random();

  return () => {
    id = id > 0 ? id - Math.random() : id + Math.random();
    return id.toString().split('.')[1];
  };
})();

const createContext = (s: PlantariumSettings): GeneratorContext => {
  let seed = 0;
  noise.seed = 0;
  let buildId = uniqID();
  return {
    handleParameter(param: ParameterResult, alpha = 1) {
      if (typeof param === 'number') return param;

      let value = param.value || 0;
      let variation = param.variation || 0;

      const isCurve = Array.isArray(value);

      if (Array.isArray(value)) {
        let values = [];

        if (param['cache'] && param['cache'].buildId === buildId) {
          values = param['cache'].values;
        } else {
          values = curve.toArray(value).map((v) => v.y);
          param['cache'] = { values, buildId };
        }

        value = interpolateArray(values, alpha);
      }

      if (typeof value === 'object' && isCurve)
        value = this.handleParameter(param, alpha);
      if (typeof variation === 'object')
        variation = this.handleParameter(variation, alpha);

      if (variation) {
        (value as number) +=
          noise.n1d(currentNoise++ * 200) *
          param.variation *
          Math.max(value as number, 1);
      }

      return value as number;
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
      buildId = uniqID();
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
