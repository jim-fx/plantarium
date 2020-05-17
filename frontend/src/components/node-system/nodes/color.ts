export default {
  name: 'Color',
  outputs: ['color'],
  state: {
    r: {
      value: 0,
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
    },
    g: {
      value: 0,
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
    },
    b: {
      value: 0,
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
    },
  },
  compute({ r = 0, g = 0, b = 0 }) {
    return [r, g, b];
  },
};
