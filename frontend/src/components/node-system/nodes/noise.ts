export default {
  name: 'Noise',
  type: 'noise',
  outputs: ['pd'],
  state: {
    input: {
      type: 'pd',
      label: 'plant',
      internal: false,
    },
    size: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 20,
      step: 0.05,
      value: 0,
    },
    strength: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0,
    },
  },
  compute(parameters) {
    return {
      type: 'noise',
      parameters,
    };
  },
};
