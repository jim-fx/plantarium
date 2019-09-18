import { wrap } from "comlink";

let generate: Function;

export default async (pd: plantDescription, settings?: settings | settings[]) => {
  if (!generate) {
    const worker = new Worker("generator.js");
    generate = wrap(worker);
    return await generate(pd, settings);
  } else {
    return await generate(pd, settings);
  }
};
