export default {
  name: 'Slider',
  outputs: ['number'],
  state: {
    id: 'value',
    type: 'number',
    inputType: 'range',
    min: -5,
    max: 5,
    steps: 0.1,
    value: 0,
  },
  compute(_inputData: any[], { value = 0 }) {
    return value;
  },
};
