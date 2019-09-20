import { wrap } from "comlink";
import overlay from "../overlay";
let generate: Function;

export default async (pd: plantDescription, settings?: settings | settings[]) => {
  if (!generate) {
    const worker = new Worker("generator.js");
    worker.addEventListener("message", msg => msg.type && msg.type === "popup" && overlay.popup(msg.value, msg.time));
    generate = wrap(worker);
    return await generate(pd, settings);
  } else {
    return await generate(pd, settings);
  }
};
