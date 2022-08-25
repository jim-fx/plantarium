import { expect, test } from 'vitest';
import { cloneObject } from '../src/cloneObject';


test('cloneObject works', () => {

  const a = { a: "test", b: false, c: 5 };

  const b = cloneObject(a);

  expect(a.a).toBe(b.a);

  a.a = "changed"
  a.b = true;
  a.c++;

  expect(a.a).not.toBe(b.a);

  expect(b.a).toBe("test");
  expect(b.b).toBeFalsy()
  expect(b.c).toBe(5)

});
