import { NodeSystem } from '../../public/dist/index.esm';

import project from './project';

describe('System Tests', () => {
  let system;

  it('Initialize NodeSystem', () => {
    system = new NodeSystem({ view: true, defaultNodes: true });
  });

  it('Move NodeSystem', () => {
    system.view.setTransform({ x: 111, y: 222, s: 3 });

    cy.wait(300).then(() => {
      expect(system.meta.transform.x).to.equal(111);
      expect(system.meta.transform.y).to.equal(222);
      expect(system.meta.transform.s).to.equal(3);
    });
  });

  it('Register default node types', () => {
    const types = system.getNodeTypes().map((type) => type.title);

    expect(0).to.be.lessThan(types.length);

    expect(types).to.contain('Boolean');

    expect(types).to.contain('Number');

    expect(types).to.contain('Math');

    expect(types).to.contain('Debug');

    expect(types).to.contain('Output');
  });

  it('Load project', () => {
    system.load(project);
  });

  it('Correct output', () => {
    cy.wait(50);
    console.log(system);
    expect(system.result).to.equal(25);
  });

  it('Initialize headless NodeSystem', () => {
    const s = new NodeSystem({ defaultNodes: true });
    s.load(project);
    cy.wait(50);
    expect(25).to.equal(25);
  });
});
