import { test, expect } from 'vitest';
import inputChanged from '../src/inputChanged';

test('works', () => {
  let currentNum = 0;

  const func = inputChanged((num: number) => {
    expect(num).not.toBe(currentNum);
    currentNum = num;
  });

  func(1);
  func(1);
  func(1);
  func(0);
  func(5);
  func(2);
});
