export default {
  name: 'Stem',
  outputs: ['pd'],
  state: {
    origin: {
      type: 'vec3',
      internal: false,
    },
    height: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 5,
      step: 0.05,
      value: 0,
    },
    thiccness: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 0.2,
      step: 0.01,
      value: 0,
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 1,
    },
  },
  compute(parameters) {
    return {
      type: 'stem',
      parameters,
    };
  },
};
