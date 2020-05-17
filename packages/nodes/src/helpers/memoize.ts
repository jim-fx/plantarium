import fastHash from './fastHash';

export default function memoize(func: (...args: any) => any) {
  const memo: { [hash: string]: any } = {};

  return (...args: any) => {
    const hash = fastHash(JSON.stringify(args));

    if (hash in memo) {
      return memo[hash];
    } else {
      return (memo[hash] = func(...args));
    }
  };
}
