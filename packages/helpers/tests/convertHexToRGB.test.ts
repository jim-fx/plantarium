import { test, expect } from 'vitest';
import convertHexToRGB from '../src/convertHexToRGB';

test('convertsCorrectly', () => {
  expect(convertHexToRGB('ff0000')).toEqual([1, 0, 0]);
});

test('handlesShortHex', () => {
  expect(convertHexToRGB('ff0')).toEqual([1, 1, 0]);
});
