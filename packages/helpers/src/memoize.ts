import fastHash from './fastHash';

export default function memoize(func: (...args: unknown[]) => unknown) {
  const memo: { [hash: string]: unknown } = {};

  return (...args: unknown[]) => {
    const hash = fastHash(JSON.stringify(args));

    if (hash in memo) {
      return memo[hash];
    } else {
      return (memo[hash] = func(...args));
    }
  };
}
