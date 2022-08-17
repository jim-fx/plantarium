/* eslint-disable no-console */
import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';
interface Logger {
  (...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(err: Error): void;
}

const isServiceWorker = typeof globalThis["WorkerGlobalScope"] !== 'undefined' && self instanceof globalThis["WorkerGlobalScope"];


let filters: string[] = [];
let level = 2;

let longestName = 0;

const scopes = {};
let currentIndex = 0;

const colors = [
  '#00ffff',
  '#f0ffff',
  '#f5f5dc',
  '#000000',
  '#0000ff',
  '#a52a2a',
  '#00ffff',
  '#00008b',
  '#008b8b',
  '#a9a9a9',
  '#006400',
  '#bdb76b',
  '#8b008b',
  '#556b2f',
  '#ff8c00',
  '#9932cc',
  '#8b0000',
  '#e9967a',
  '#9400d3',
  '#ff00ff',
  '#ffd700',
  '#008000',
  '#4b0082',
  '#f0e68c',
  '#add8e6',
  '#e0ffff',
  '#90ee90',
  '#d3d3d3',
  '#ffb6c1',
  '#ffffe0',
  '#00ff00',
  '#ff00ff',
  '#800000',
  '#000080',
  '#808000',
  '#ffa500',
  '#ffc0cb',
  '#800080',
  '#800080',
  '#ff0000',
  '#c0c0c0',
  '#ffffff',
  '#ffff00',
];

const localStorageId = 'plant.log.history';
const hasLocalStorage = 'localStorage' in globalThis;

const history = hasLocalStorage
  ? localStorageId in localStorage
    ? JSON.parse(localStorage.getItem(localStorageId))
    : []
  : [];

if (hasLocalStorage) {
  level = parseInt(localStorage.getItem('pt-log-level')) || 2;
}

function saveHistory() {
  hasLocalStorage &&
    localStorage.setItem(localStorageId, JSON.stringify(history));
}

let store: undefined | Writable<unknown[]>;

function log(scope: string): Logger {

  longestName = Math.max(longestName, scope.length);

  const myIndex = currentIndex;

  scopes[scope] = colors[currentIndex];
  currentIndex++;

  const handleLog = (args: unknown[] | Error, _level: number) => {

    if (isServiceWorker) return;
    history.push({ scope, args, level, date: Date.now() });
    history.length = Math.min(100, history.length);
    if (store) store.set(history);
    saveHistory();
    if ((!filters.length || filters.includes(scope)) && _level <= level) {
      // Handle all errors
      if (args instanceof Error) {
        console.error(`[${scope.padEnd(longestName, ' ')}]`, args);
        return;
      }

      // Make some logs better to read
      if (
        Array.isArray(args) &&
        typeof args[0] === 'string' &&
        typeof args[1] === 'object'
      ) {
        console.groupCollapsed(
          `%c[${scope.padEnd(longestName, ' ')}]`,
          `color: hsl(${myIndex * 30}deg 68% 64%); font-weight: bold;`,
          args[0],
        );
        console.log(...args.slice(1));
        console.groupEnd();
        return;
      }

      if (_level === 0) {
        console.error(
          `%c[${scope.padEnd(longestName, ' ')}]`,
          `color: hsl(${myIndex * 30}deg 68% 64%); font-weight: bold;`,
          ...args,
        );
        return;
      }

      if (_level === 1) {
        console.warn(`[${scope.padEnd(longestName, ' ')}]`, ...args);
        return;
      }

      if (_level === 2) {
        console.log(
          `%c[${scope.padEnd(longestName, ' ')}]`,
          `color: hsl(${myIndex * 30}deg 68% 64%); font-weight: bold;`,
          ...args,
        );
      }
    }
  };

  const log = (...args: unknown[]) => handleLog(args, 2);

  log.warn = (...args: []) => handleLog(args, 1);

  log.error = (err: Error) => handleLog(err, 0);

  return log;
}

log.getStore = function() {
  if (store) return store;
  store = writable([]);
  return store;
};

log.getHistory = function() {
  return [...history]
}

log.setFilter = (...f: string[]) => {
  filters = f;
  console.log("[log] set filter", { filters })
};

log.setLevel = (l = 0) => {
  level = l;
  if (globalThis["localStorage"]) {
    localStorage.setItem('pt-log-level', '' + l);
  }
};

export default log;
