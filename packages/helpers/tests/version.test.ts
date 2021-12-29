import { test, expect } from 'vitest';
import versionToNumber from '../src/versionToNumber';

test('works', () => {
  const num = versionToNumber('0.2.5');

  expect(num).toEqual(25);

  expect(versionToNumber('1.0.2')).toEqual(102);
});
