/* eslint-disable no-console */

interface Logger {
  (...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(err: Error): void;
  group(...args: unknown[]): void;
}

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

const localStorageId = "plant.log.history";

const history = "localStorage" in globalThis ? (localStorageId in localStorage ? JSON.parse(localStorage.getItem(localStorageId)) : []) : [];

function saveHistory() {
  localStorage.setItem(localStorageId, JSON.stringify(history));
}

function log(scope: string): Logger {
  longestName = Math.max(longestName, scope.length);

  const myIndex = currentIndex;

  scopes[scope] = colors[currentIndex];
  currentIndex++;

  const log = (...args: unknown[]) => {
    history.push({ scope, args })
    history.length = Math.min(100, history.length);
    saveHistory();
    if ((!filters.length || filters.includes(scope)) && level === 0) {
      // Make some logs better to read
      if (typeof args[0] === 'string' && typeof args[1] === 'object') {
        console.groupCollapsed(
          `%c[${scope.padEnd(longestName, ' ')}]`,
          `color: hsl(${myIndex * 30}deg 68% 64%); font-weight: bold;`,
          args[0],
        );
        console.log(...args.slice(1));
        console.groupEnd();
        return;
      }

      console.log(
        `%c[${scope.padEnd(longestName, ' ')}]`,
        `color: hsl(${myIndex * 30}deg 68% 64%); font-weight: bold;`,
        ...args,
      );
    }
  };

  log.group = (...args: []) => {
    if (level < 1)
      console.groupCollapsed(
        `%c[${scope.padEnd(longestName, ' ')}]`,
        `color: hsl(${myIndex * 30}deg 68% 64%); font-weight: bold;`,
        ...args,
      );
  };

  log.warn = (...args: []) => {
    if (level <= 1)
      console.warn(`[${scope.padEnd(longestName, ' ')}]`, ...args);
  };

  log.error = (err: Error) => {
    console.error(`[${scope.padEnd(longestName, ' ')}]`, err);
  };

  return log;
}

log.setFilter = (...f: string[]) => {
  filters = f;
};

log.setLevel = (l = 0) => {
  level = l;
};

export default log;
