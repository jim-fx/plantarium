const node: NodeTypeData = {
  title: 'Math',
  type: 'math',
  outputs: ['number'],
  parameters: {
    mode: {
      type: 'whatever',
      internal: true,
      inputType: 'selection',
      values: ['add', 'multiply', 'subtract'],
    },
    a: {
      type: 'number',
      defaultValue: 0,
    },
    b: {
      type: 'number',
      defaultValue: 0,
    },
  },
  compute({ mode, a, b }: { a: number; b: number; mode: string }) {
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
