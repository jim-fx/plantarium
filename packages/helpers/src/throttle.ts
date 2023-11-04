export default <R, A extends any[]>(
  fn: (...args: A) => R,
  delay: number
): ((...args: A) => R) => {
  let wait = false;

  return (...args: A) => {
    if (wait) return undefined;

    const val = fn(...args);

    wait = true;

    setTimeout(() => {
      wait = false;
    }, delay);

    return val;
  }
};
