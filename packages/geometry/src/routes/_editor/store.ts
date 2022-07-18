import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
const store =
  ('localStorage' in globalThis && 'store' in localStorage) ? JSON.parse(localStorage.getItem('store')) : {};
save();

function save() {
  if (!("localStorage" in globalThis)) return;
  localStorage.setItem('store', JSON.stringify(store));
}

export function set(key: string, value: unknown) {
  store[key] = value;
  if (key in writablesCaches) writablesCaches[key].set(value);
  save();
}

export function get(key: string, defaultValue?: unknown) {
  if (key in store) {
    return store[key];
  }

  store[key] = defaultValue;
  save();
  return defaultValue;
}

const writablesCaches: Record<string, Writable<unknown>> = {};
export function createWritable<T>(key: string, defaultValue: T): Writable<T> {
  if (key in writablesCaches) return writablesCaches[key] as Writable<T>;
  writablesCaches[key] = writable(defaultValue)
  return writablesCaches[key] as Writable<T>;
}

export default { get, set, createWritable };
