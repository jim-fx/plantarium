import { test, expect } from 'vitest';
import aggregate from '../src/aggregate';

class A {
  public propA = 'A';
}

class B {
  public propB = 'B';
}

test('aggregation works', () => {
  class C extends aggregate(A, B) {
    public propC = 'C';
  }

  const c = new C();

  expect(c.propA).toBe('A');
  expect(c.propB).toBe('B');
  expect(c.propC).toBe('C');
});
