export function getBoundingValue(_v: number) {
  const v = Math.abs(_v);

  let level = 1;
  const levels = [1, 2, 4, 10, 20, 50, 100, 200, 300, 400, 500, 1000];

  for (const l of levels) {
    level = l;
    if (l >= v) break;
  }

  return _v >= 0 ? level : -level;
}
