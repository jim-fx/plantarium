let logLevel: number = parseInt(localStorage.pdLogLevel) || 2;
//0 = only errors;
//1 = errors+warnings
//2 = all major components
//3 = all components

export default function logger(name: string) {
  function log(msg: string, _logLevel: number = 1) {
    if (logLevel < _logLevel) return;
    console.log(name + " | " + msg);
  }

  log.error = function(msg: string) {
    console.error(name + " | " + msg);
  };

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
