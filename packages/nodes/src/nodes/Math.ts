export default {
  name: 'Math',
  inputs: ['number', 'number'],
  outputs: ['number'],
  state: {
    mode: {
      external: false,
      values: ['add', 'multiply', 'subtract'],
    },
    input1: {
      type: 'number',
    },
    input2: {
      type: 'number',
    },
  },
  compute({ input1 = 0, input2 = 0, mode = 'add' }) {
    switch (mode) {
      case 'multiply':
        return input1 * input2;
      case 'subtract':
        return input1 - input2;
      default:
        return input1 + input2;
    }
  },
};
