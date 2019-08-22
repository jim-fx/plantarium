const logLevel: number = 2;
//0 = only errors;
//1 = errors+warnings
//2 = all messages

export default function logger(name: string) {
  function log(msg: string, _logLevel: number = 1) {
    if (logLevel < _logLevel) return;
    console.log(name + " | " + msg);
  }

  log.error = function(msg: string) {
    console.error(name + " | " + msg);
  };

  return log;
}
