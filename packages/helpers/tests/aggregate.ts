import { test } from 'uvu';
import * as assert from 'uvu/assert';
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

  assert.equal(c.propA, 'A');
  assert.equal(c.propB, 'B');
  assert.equal(c.propC, 'C');
});

test.run();
