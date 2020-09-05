export default {
  name: 'Gravity',
  type: 'gravity',
  outputs: ['pd'],
  state: {
    input: {
      type: 'pd',
      label: 'plant',
      internal: false,
    },
    type: {
      value: 'simple',
      values: ['simple', 'verlet'],
    },
    strength: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
      value: 0,
    },
  },
  compute(parameters) {
    return {
      type: 'gravity',
      parameters,
    };
  },
};
