// Shamelessly copied from
// https://stackoverflow.com/a/8831937

export default function (input: string) {
  if (input.length === 0) return 0;

  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i); // tslint:disable-line no-bitwise
    hash = hash & hash; // tslint:disable-line no-bitwise
  }

  return hash;
}
