import { test } from 'uvu';
import * as assert from 'uvu/assert';
import inputChanged from '../src/inputChanged';

test('works', () => {
  let currentNum = 0;

  const func = inputChanged((num: number) => {
    assert.not.equal(num, currentNum);
    currentNum = num;
  });

  func(1);
  func(1);
  func(1);
  func(0);
  func(5);
  func(2);
});

test.run();
