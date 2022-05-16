import { checkNodeType } from "../types";

export default checkNodeType({
  title: 'Math',
  type: 'math',
  outputs: ['number', 'number'],
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
  compute({ mode, a, b }) {
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
