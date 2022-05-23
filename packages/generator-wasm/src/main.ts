// example.js
import { instantiate } from './main.zig';

const out = { s: "" };
const importObject = {
  env: { returnObject, returnString, print: (...args) => { throw new Error("timeout") } }
};

// instantiate the compiled WebAssembly module, can also be moved
// to a Worker for instantiation in another thread
const { exports } = await instantiate(importObject);

function getString(ptr: number, len: number) {
  const slice = exports.memory.buffer.slice(ptr, ptr + len);
  const textDecoder = new TextDecoder();
  return textDecoder.decode(slice);
}

export function returnString(ptr: number, len: number) {
  out.s = getString(ptr, len);
}

export function returnObject(ptr: number, len: number) {
  out.s = JSON.parse(getString(ptr, len));
}



globalThis["test"] = {
  hello: (num: number) => {
    exports.hello(num);
    return out.s;
  },
};
