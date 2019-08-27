export default (func: Function, limit: number) => {
  let lastFunc: NodeJS.Timeout;
  let lastRan: number;
  return function() {
    if (!lastRan) {
      func();
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func();
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};
