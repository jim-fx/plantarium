/**
 * Only calls the passed function when the input parameters changed
 * Warning: works with JSON.stringify, so key order in POJOS is ignored
 * @param func Function to proxy
 */
export default function memoize(func: (...args: any) => any) {
  const lastArgs = '';

  return (...args: any) => {
    const newArgs = JSON.stringify(args);

    if (newArgs !== lastArgs) {
      return func(...args);
    }
  };
}
