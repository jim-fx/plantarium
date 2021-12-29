import { test, expect } from 'vitest';
import fastHash from '../src/fastHash';

test('Hashes dont clash', () => {
  const hashA = fastHash('abcdef');
  const hashB = fastHash('abcde');
  const hashC = fastHash('abcde');

  expect(hashA).not.toEqual(hashB);
  expect(hashB).toEqual(hashC);
});
