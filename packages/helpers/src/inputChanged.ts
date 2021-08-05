/**
 * Only calls the passed function when the input parameters changed
 * Warning: works with JSON.stringify, so key order in POJOS is ignored
 * @param func Function to proxy
 */
export default function memo<A extends unknown[], R>(fn: (...args: A) => R) {
  let value: R,
    before: A = { length: NaN } as A;

  const sameAsBefore = (v: A[number], i: number) => v === before[i];
  return function memo(...args: A): R {
    if (args.length !== before.length || !args.every(sameAsBefore)) {
      before = args;
      value = fn.apply(this, args);
    }
    return value;
  };
}
