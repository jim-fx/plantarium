const node: PlantNode = {
  title: 'Math',
  type: 'math',
  outputs: ['number'],
  parameters: {
    mode: {
      type: 'whatever',
      internal: true,
      inputType: 'selection',
      label: false,
      defaultValue: 'add',
      values: ['add', 'multiply', 'subtract'],
    },
    a: {
      type: 'number',
      defaultValue: 0,
      label: false,
    },
    b: {
      type: 'number',
      defaultValue: 0,
      label: false,
    },
  },

  computeValue(parameters, ctx, alpha): number {
    const { mode } = parameters;
    const a = ctx.handleParameter(parameters.a, alpha);
    const b = ctx.handleParameter(parameters.b, alpha);

    switch (mode) {
      case 'multiply':
        return a * b;
      case 'subtract':
        return a - b;
      default:
        return a + b;
    }
  },
};

export default node;
