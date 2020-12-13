export default {
  name: 'Noise',
  outputs: ['pd'],
  state: {
    input: {
      type: 'pd',
      label: 'plant',
      internal: false,
    },
    strength: {
      value: 0,
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
    },
    scale: {
      value: 0,
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 10,
      step: 0.5,
    },
  },
  compute(parameters) {
    return {
      type: 'noise',
      parameters,
    };
  },
};
