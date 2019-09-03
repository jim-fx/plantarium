let logLevel: number = parseInt(localStorage.pdLogLevel) || 1;
//0 = only errors;
//1 = errors+warnings
//2 = all major components
//3 = all components

interface log {
  (msg: string, logLevel: number): void;

  error: (msg: string) => void;
  level: number;
}

export default function logger(name: string): log {
  function log(msg: string, _logLevel: number = 1) {
    if (logLevel < _logLevel) return;
    console.log(name + " | " + msg);
  }

  log.error = function(msg: string) {
    console.error(name + " | " + msg);
  };

  log.level = logLevel;

  Object.defineProperty(log, "level", {
    get: function() {
      return logLevel;
    },
    set: function(value) {
      logLevel = value;
      localStorage.pdLogLevel = logLevel;
    }
  });

  return log;
}
