import { test } from 'uvu';
import * as assert from 'uvu/assert';

import box from "../src/shapes/box"
import join from "../src/helpers/join"
import instanceGeometry from "../src/helpers/instanceGeometry";
import convertInstancedGeometry from "../src/helpers/convertInstancedGeometry";
import rotate2D from "../src/helpers/rotate2D";

test("box", () => {

  const b = box(1);

  assert.equal(b.position.length, 24);

})

test("join", () => {
  const a = box(1);
  const b = box(1)

  const result = join(a, b);

  assert.equal(result.position.length, a.position.length + b.position.length, "Position amount is okay");
  assert.equal(result.index.length, a.index.length + b.index.length, "Position amount is okay");
});

test("instance geometry", () => {
  const b = box(1);

  const instanced = instanceGeometry(b, { offset: [1, 1, 1, 0, 0, 0] })

  assert.equal(instanced.rotation.length, instanced.offset.length)
  assert.equal(instanced.offset.length, instanced.scale.length)

})


test("convert instance geometry", () => {
  const b = box(1);

  const instanced = instanceGeometry(b, { offset: [1, 1, 1, 0, 0, 0] })

  const real = convertInstancedGeometry(instanced);

  assert.equal(real.length, 2);

  const joined = join(...real);

  assert.equal(joined.position.length, 48);

})


test("rotate2D", () => {

  const vec1 = [0, 1];

  // Rotate 180 deg
  const res1 = rotate2D(vec1, Math.PI);
  assert.equal(res1[1], -1);


  // Rotate 90 deg
  const res2 = rotate2D(vec1, Math.PI / 2);
  assert.equal(res2[0], 1)

})

test.run()
