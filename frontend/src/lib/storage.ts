import { browser } from "$app/env";

import { openDB } from 'idb';

const dbPromise = browser && openDB('keyval-store', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');
  },
});

const readCache: Record<string, unknown> = {};
const writeCache: Record<string, unknown> = {};

let lastSave = 0;
export async function setItem<T>(key: string, val: T) {
  if (!browser) {
    readCache[key] = val;
    return;
  }

  if (performance.now() - lastSave > 2000) {
    for (const [_key, _val] of Object.entries(writeCache)) {
      (await dbPromise).put('keyval', _val, _key);
      delete writeCache[_key];
    }
    lastSave = performance.now();

  }

  writeCache[key] = val;
  readCache[key] = val;

}

export async function getItem(key: string) {
  if (!browser) {
    return readCache[key];
  }

  if (key in readCache) {
    return readCache[key];
  }

  const value = (await dbPromise).get('keyval', key);

  readCache[key] = value;

  return value;
}

export async function removeItem(key: string) {
  if (!browser) {
    delete readCache[key]
    return;
  }
  return (await dbPromise).delete('keyval', key);
}
