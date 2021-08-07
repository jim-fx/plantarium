import { NodeSystem } from '../../public/dist/index.esm';

describe('Node Tests', () => {
  const system = new NodeSystem({ view: true, defaultNodes: true });

  it('Register default NodeTypes', () => {
    const types = system.getNodeTypes().map((nodeType) => nodeType.type);

    expect(0).to.be.lessThan(types.length);

    expect(types).to.contain('boolean');

    expect(types).to.contain('number');

    expect(types).to.contain('math');
  });

  it('Move nodes', () => {
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

    expect(node.attributes.pos.x).to.equal(50);
    expect(node.attributes.pos.y).to.equal(70);
  });

  it('Connect/Disconnect nodes', (done) => {
    const outputNode = system.createNode({
      attributes: {
        id: '0',
        type: 'output',
      },
    });

    const numberNode = system.createNode({
      attributes: {
        id: '0',
        type: 'number',
      },
      state: {
        value: 1337,
      },
    });

    numberNode.connectTo(outputNode);

    cy.wait(20);

    expect(system.result).to.equal(1337);

    numberNode.remove();

    cy.wait(20);

    expect(system.result).to.equal(undefined);

    done();
  });

  it('Test NumberNode', (done) => {
    const node = system.createNode({
      attributes: {
        id: '0',
        type: 'number',
      },
      state: {
        value: 2,
      },
    });

    node.on('computedData', (data) => {
      expect(data).to.equal(1337);
      done();
    });

    node.setStateValue('value', 1337);
  });

  it('Test BooleanNode', (done) => {
    const node = system.createNode({
      attributes: {
        id: '0',
        type: 'boolean',
      },
      state: {
        value: false,
      },
    });

    node.on('computedData', (data) => {
      expect(data).to.equal(true);
      done();
    });

    node.setStateValue('value', true);
  });

  it('Test MathNode', (done) => {
    const node = system.createNode({
      attributes: {
        id: '0',
        type: 'math',
      },
      state: {
        mode: 'multiply',
      },
    });

    node.setStateValue('a', 5);
    node.setStateValue('b', 5);
    cy.wait(10);
    expect(node.computedData).to.equal(25);

    node.setStateValue('a', 17);
    node.setStateValue('b', 11);
    node.setStateValue('mode', 'subtract');
    cy.wait(10);
    expect(node.computedData).to.equal(6);

    node.setStateValue('a', 17);
    node.setStateValue('b', 11);
    node.setStateValue('mode', 'add');
    cy.wait(10);
    expect(node.computedData).to.equal(28);

    done();
  });

  it('Test DebugNode', (done) => {
    const node = system.createNode({
      attributes: {
        type: 'debug',
      },
    });

    node.on('computedData', (data) => {
      expect(data).to.equal('This is a random string');
      done();
    });

    node.setStateValue('input', 'This is a random string');
  });
});
