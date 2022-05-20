import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Math',
  type: 'math',
  outputs: ['number'],
  meta: {
    description: `The math node provides some basic math functionality to transform numbers.`
  },
  parameters: {
    mode: {
      type: 'select',
      internal: true,
      label: false,
      value: 'add',
      values: ['add', 'multiply', 'subtract'],
    },
    a: {
      type: 'number',
      value: 0,
      label: false,
    },
    b: {
      type: 'number',
      value: 0,
      label: false,
    },
  },

  computeValue(parameters, _, alpha): number {
    const { mode } = parameters;
    const a = parameters.a(alpha);
    const b = parameters.b(alpha);

    switch (mode) {
      case 'multiply':
        return a * b;
      case 'subtract':
        return a - b;
      default:
        return a + b;
    }
  },
});

