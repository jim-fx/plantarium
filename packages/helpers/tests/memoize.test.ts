import { test, expect, vitest } from 'vitest';
import memoize from '../src/memoize';

test('works', () => {
  const fn = vitest.fn();

  const memoizedFunc = memoize(function (a, b) {
    fn();
  });

  memoizedFunc('Test', 'A');
  memoizedFunc('Test', 'A');
  memoizedFunc('Test', 'B');

  expect(fn).toBeCalledTimes(2);
});
