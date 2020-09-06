export default {
  name: 'Branches',
  outputs: ['pd'],
  state: {
    input: {
      type: 'pd',
      label: 'plant',
      internal: false,
    },
    length: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 10,
      step: 0.05,
      value: 0,
    },
    thiccness: {
      type: 'number',
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.8,
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
      type: 'branch',
      parameters,
    };
  },
};
