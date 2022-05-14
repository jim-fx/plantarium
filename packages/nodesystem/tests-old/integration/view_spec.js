import project from './project';

describe('View Layer Tests', async () => {
  let system;

  it('Initialize NodeSystem', (done) => {
    cy.visit('/');
    cy.window().then((win) => {
      system = win.system;
      system.load(project);
      expect(system).to.not.be.undefined;
      done();
    });
  });

  it('BoxSelection', () => {
    cy.visit('/');
    let s;
    cy.window()
      .then(({ system }) => {
        s = system;
        system.view.handleMouseDown({
          ctrlKey: true,
          clientX: -1000,
          clientY: -1000,
        });
      })
      .then(() => cy.wait(100))
      .then(() => {
        s.view.handleMouseMove({
          ctrlKey: true,
          clientX: 1000,
          clientY: 1000,
        });
      })
      .then(() => cy.wait(100))
      .then(() => {
        s.view.emit('mouseup');

        expect(s.view.selectedNodes.length).to.equal(3);
      });
  });

  it('AddMenu', (done) => {
    cy.visit('/');
    cy.wait(100).then(() => {
      cy.window().then(({ system }) => {
        system.view.addMenu.show({ x: 0, y: 0 }).then((node) => {
          expect(node.attributes.name.toLowerCase()).to.contain('m');
          done();
        });

        cy.focused().type('m');
        system.view.emit('keydown', { key: 'ArrowDown' });
        system.view.emit('keydown', { key: 'ArrowUp' });
        cy.focused().type('{enter}');
      });
    });
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

      system.view.handleMouseDown({ clientX: 67, clientY: 100, ctrlKey: true });
    }).not.to.throw();
  });
});
