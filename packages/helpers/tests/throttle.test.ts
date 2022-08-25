import { expect, test, vitest } from 'vitest';
import throttle from '../src/throttle';

const wait = (t: number) => new Promise(res => setTimeout(res, t));


test('Expect throttle to work', async () => {
  const fn = vitest.fn();

  const func = throttle(fn, 100);

  let i = 0;
  const int = setInterval(() => {
    i++;
    if (i === 5) {
      clearInterval(int);
    }
    func(i);
  }, 50);

  await wait(300);

  expect(fn).toBeCalledTimes(3);

});


test("Expect throttle to pass correct arguments", async () => {

  const callback = (a: string, b: number) => {
    expect(a).toEqual("arg1");
    expect(b).toEqual(42);
  };
  const func = throttle(callback, 100);

  let i = 0;
  const int = setInterval(() => {
    i++;
    if (i === 5) {
      clearInterval(int);
    }
    func("arg1", 42);
  }, 50);

  await wait(400);


})
