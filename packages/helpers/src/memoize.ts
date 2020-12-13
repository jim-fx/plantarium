import fastHash from './fastHash';

export default function memoize(func: (...args) => unknown) {
  const memo: { [hash: string]: unknown } = {};

  return (...args) => {
    const hash = fastHash(JSON.stringify(args));

    if (hash in memo) {
      return memo[hash];
    } else {
      return (memo[hash] = func(...args));
    }
  };
}
