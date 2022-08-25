import { browser } from '$app/env';
import { throttle } from '@plantarium/helpers';

import { openDB } from 'idb';

const dbPromise =
  browser &&
  openDB('plantarium-store', 1, {
    upgrade(db) {
      db.createObjectStore('projects');
    }
  });


const readCache: Record<string, unknown> = {};
const writeCache: Record<string, unknown> = {};

const persistWriteCache = throttle(async function() {
  for (const [_key, _val] of Object.entries(writeCache)) {
    (await dbPromise).put('projects', _val, _key);
    delete writeCache[_key];
  }
}, 1000)

export async function setItem<T>(key: string, val: T) {
  if (!browser) {
    readCache[key] = val;
    return;
  }

  persistWriteCache()

  writeCache[key] = val;
  readCache[key] = val;
}

export async function getItem<T = unknown>(key: string): Promise<T | null> {

  if (!browser) {
    return readCache[key] as T | null;
  }

  if (key in readCache) {
    return readCache[key] as T | null;
  }

  const value = await (await dbPromise).get('projects', key) as Promise<T | null>;

  readCache[key] = value;

  return value as Promise<T | null>;
}

export async function removeItem(key: string) {
  delete readCache[key];
  if (!browser) { return; }
  return (await dbPromise).delete('projects', key);
}
