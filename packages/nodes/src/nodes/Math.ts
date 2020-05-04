export default {
  name: 'Math',
  inputs: ['number', 'number'],
  outputs: ['number'],
  state: {
    id: 'mode',
    inputType: 'selection',
    values: ['add', 'multiply', 'subtract'],
  },
  compute([input1 = 0, input2 = 0]: number[], state) {
    switch (state) {
      case 'multiply':
        return input1 * input2;
      case 'subtract':
        return input1 - input2;
      default:
        return input1 + input2;
    }
  },
};
