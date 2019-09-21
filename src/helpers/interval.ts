export default function(func: Function, time: number) {
  let int = setInterval(func, time);
  return {
    stop: () => clearInterval(int),
    start: () => {
      int && clearInterval(int);
      int = setInterval(func, time);
    }
  };
}
