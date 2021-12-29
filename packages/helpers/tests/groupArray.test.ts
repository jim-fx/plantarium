import { test, expect } from 'vitest';
import groupArray from '../src/groupArray';

test('Should group correctly', () => {
  const res = groupArray([1, 2, 3, 4, 5, 6, 7, 8, 9], 3);
  expect(res).toEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
});
