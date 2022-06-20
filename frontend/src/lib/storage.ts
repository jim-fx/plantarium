import { browser } from "$app/env"

import { openDB } from 'idb';

const dbPromise = browser && openDB('keyval-store', 1, {
  upgrade(db) {
    db.createObjectStore('keyval');
  },
});

let s: Record<string, any> = {};

export async function setItem(key: string, val: any) {
  if (!browser) {
    s[key] = val;
    return;
  }
  return (await dbPromise).put('keyval', val, key);
}

export async function getItem(key: string) {
  if (!browser) {
    return s[key];
  }
  return (await dbPromise).get('keyval', key);
}

export async function removeItem(key: string) {
  if (!browser) {
    delete s[key]
    return;
  }
  return (await dbPromise).delete('keyval', key);
}
