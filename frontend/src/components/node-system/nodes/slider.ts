export default {
  name: 'Slider',
  outputs: ['number'],
  state: {
    value: {
      type: 'number',
      inputType: 'slider',
      external: false,
      min: 0,
      max: 1,
      step: 0.01,
      value: 0,
    },
  },
  compute({ value = 0 }) {
    return value;
  },
};
