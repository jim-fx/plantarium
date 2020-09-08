interface Logger {
  (...args: any[]): void;
  warn(...args: any[]): void;
  error(err: Error): void;
}

let filters: string[] = [];
let level = 0;

function log(scope: string): Logger {
  const log = (...args: []) => {
    if ((!filters.length || filters.includes(scope)) && level === 0) {
      console.log(`[${scope}]`, ...args);
    }
  };

  log.warn = (...args: []) => {
    if (level <= 1) console.warn(`[${scope}]`, ...args);
  };

  log.error = (err: Error) => {
    if (level <= 2) console.error(`[${scope}]`, err);
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
