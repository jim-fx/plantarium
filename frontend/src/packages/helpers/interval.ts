export default function (func: () => unknown, time: number) {
  let int = setInterval(func, time);
  return {
    stop: () => clearInterval(int),
    start: () => {
      if (int) clearInterval(int);
      int = setInterval(func, time);
    },
  };
}
