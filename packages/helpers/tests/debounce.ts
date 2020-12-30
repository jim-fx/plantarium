import { test } from 'uvu';
import * as assert from 'uvu/assert';
import debounce from '../src/debounce';

const wait = (timeout) => new Promise((res) => setTimeout(res, timeout));

test('debouncesCorrectly', async () => {
  let i = 0;

  const func = debounce(() => {
    i++;
  }, 200);

  func();
  await wait(100);
  func();
  await wait(100);
  func();
  await wait(200);
  func(); // <-- this is the only func that should be called
  await wait(100);
  func();

  assert.equal(i, 1);
});

test.run();
