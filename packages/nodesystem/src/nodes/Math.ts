const node: NodeTypeData = {
  title: 'Math',
  type: 'math',
  outputs: ['number'],
  parameters: {
    mode: {
      type: 'whatever',
      internal: true,
      inputType: 'selection',
      label: false,
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
