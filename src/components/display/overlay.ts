import msGraph from "./msGraph";
const wrapper = <HTMLElement>document.getElementById("overlay-wrapper");

const renderPerf = msGraph("render", 0, 0, wrapper);
const generatePerf = msGraph("generate", 0, 100, wrapper);

export default {
  ms: (ms: number) => renderPerf(ms),
  gen: (ms: number) => generatePerf(ms)
};
