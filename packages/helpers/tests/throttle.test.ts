import { test, expect, vitest } from 'vitest';
import throttle from '../src/throttle';

const wait = (t: number) => new Promise((res) => setTimeout(res, t));

test('Expect throttle to work', async (done) => {
  const fn = vitest.fn();

  const func = throttle(fn, 100);

  let i = 0;
  const int = setInterval(() => {
    i++;
    if (i === 5) {
      clearInterval(int);
      expect(fn).toBeCalledTimes(2);
      done();
    }
    func();
  }, 50);
});
