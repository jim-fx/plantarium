import { NodeSystem } from '../../public/dist/index.esm';

import project from './project';

describe('View Layer Tests', () => {
  let system;

  it('Initialize NodeSystem', () => {
    system = new NodeSystem({ view: true, defaultNodes: true });
    system.load(project);
  });

  it('BoxSelection', () => {
    cy.visit('/');
    system.view.handleMouseDown({ clientX: -10000, clientY: -1000 });

    cy.wait(100)
      .then(() => {
        system.view.handleMouseMove({ clientX: 1000, clientY: 1000 });
        console.log(system.view);
      })
      .then(() => cy.wait(100))
      .then(() => {
        system.view.emit('mouseup', { x: 1000, y: 1000 });

        expect(system.view.selectedNodes.length).to.equal(system.nodes.length);
      });
  });

  it('AddMenu', (done) => {
    system.view.addMenu.show({ x: 200, y: 200 }).then((node) => {
      expect(node).not.to.equal(undefined);
      done();
    });
    system.view.addMenu.search('m');
    system.view.emit('keydown', { key: 'ArrowDown' });
    system.view.emit('keydown', { key: 'ArrowUp' });
    system.view.addMenu.resolve();
  });

  it('FloatingConnection', () => {
    const node = system.createNode({
      attributes: {
        id: '0',
        type: 'number',
      },
    });

    const { x, y } = system.outputNode.getInputs()[0].view;

    expect(() => {
      console.log(node);
      system.view.createFloatingConnection(node.outputs[0]);
      system.view.handleMouseMove({
        clientX: x,
        clientY: y,
        ctrlKey: false,
      });
      system.view.emit('mouseup', { x, y, keys: { ctrlKey: false } });
    }).not.to.throw();
  });

  it('setActive', () => {
    const node = system.createNode({
      attributes: {
        id: '1',
        type: 'number',
      },
    });

    system.view.setActive(node);
    system.view.setActive(system.outputNode, { shiftKey: true });
    system.view.setActive(node, { shiftKey: true, ctrlKey: true });
    expect(system.view.getSelectedNodes()).to.contain(node);

    system.view.setActive(system.outputNode, { ctrlKey: true });
    expect(system.view.getSelectedNodes()).to.contain(system.outputNode);

    system.view.setActive();
    expect(system.view.getSelectedNodes().length).to.equal(0);
  });

  it('Mocks events', () => {
    expect(() => {
      system.view.handleKeyDown({ key: 'A' });

      system.view.handleKeyDown({ key: 'F' });

      system.view.handleKeyDown({ key: 'X' });

      system.view.handleKeyDown({ key: 'V' });

      system.view.handleScroll({ deltaY: 67 });

      system.view.handleMouseDown({ clientX: 67, clientY: 100, ctrlKey: true });
    }).not.to.throw();
  });
});
