import { expose } from "comlink";
import generate from "./generate";

let settings: settings = <settings>{};

expose((pd: plantDescription, _s: settings | settings[] = settings) => {
  if (Array.isArray(_s)) {
    settings = _s[0];
    return _s.map(s => generate(pd, s, false));
  } else {
    settings = _s;
    return generate(pd, _s);
  }
});
