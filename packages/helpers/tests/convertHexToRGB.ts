import { test } from 'uvu';
import * as assert from 'uvu/assert';
import convertHexToRGB from '../src/convertHexToRGB';

test('convertsCorrectly', () => {
  assert.equal(convertHexToRGB('ff0000'), [1, 0, 0]);
});

test('handlesShortHex', () => {
  assert.equal(convertHexToRGB('ff0'), [1, 1, 0]);
});

test.run();
