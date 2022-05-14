// tests/demo.js
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { NodeSystem } from "../../public-test/dist/index.esm.mjs"
console.log(NodeSystem)
import project from '../data/project';

let system: NodeSystem;

const wait = (t: number) => new Promise(res => setTimeout(res, t));

test('It initializes', () => {
  system = new NodeSystem({ view: true, defaultNodes: true });
  assert.ok(system);
});

test('Register default NodeTypes', () => {
  const types = system.getNodeTypes().map((nodeType) => nodeType.type);

  assert.ok(types.length > 0)

  assert.ok(types.includes("boolean"));

  assert.ok(types.includes("number"));

  assert.ok(types.includes("number"));
});

test("Moves Node", () => {
  const node = system.createNode({
    attributes: {
      id: '0',
      type: 'number',
    },
    state: {
      value: 2,
    },
  });

  node.view.setPosition(50, 70);

  assert.equal(node.attributes.pos.x, 50);
  assert.equal(node.attributes.pos.y, 70);

})

test("loads project", async () => {
  system.load(project);

  await wait(50)

  assert.equal(system.result, 25);

})

test.run();
