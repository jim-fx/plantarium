import {
  GeneratorContext,
  ParameterResult,
  PlantariumSettings,
} from '@plantarium/types';

let lastSettings = '';
let lastCtx;

const createContext = (s: PlantariumSettings): GeneratorContext => {
  return {
    handleParameter(param: ParameterResult, alpha?: number) {
      return alpha;
    },
    getSetting(key: string) {
      return s[key];
    },
    get seed() {
      return Math.random();
    },
    refresh() {
      return Math.random();
    },
  };
};

export default (settings: PlantariumSettings) => {
  const s = JSON.stringify(settings);

  if (s !== lastSettings) {
    lastSettings = s;
    lastCtx = createContext(settings);
  }

  return lastCtx;
};
