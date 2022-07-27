export function compressLogs(log: any[]): any[] {
  return log.map((l) => {
    if (l.args) {
      if (Array.isArray(l.args)) {
        l.args = l.args.map((a) => {
          if (typeof a === 'string' && a.length < 500) return a;
          const arg = JSON.stringify(a);
          if (arg.length < 2000) return a;
          return arg.slice(0, 2000);
        });
      } else {
        const args = JSON.stringify(l.args);
        if (args.length > 2000) {
          l.args = {};
        }
      }
    }

    return l;
  });
}


