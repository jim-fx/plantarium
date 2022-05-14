import { NodeSystem } from '../../public/dist/index.esm';

import project from './project';

describe('System Tests', () => {
  let system;

  it('Load project', () => {
    system.load(project);
  });

  it('Correct output', () => {
    cy.wait(50);
    expect(system.result).to.equal(25);
  });

  it('Initialize headless NodeSystem', () => {
    const s = new NodeSystem({ defaultNodes: true });
    s.load(project);
    cy.wait(50);
    expect(25).to.equal(25);
  });
});
