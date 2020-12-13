const node: PlantNode = {
  title: 'Parameter',
  type: 'parameter',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      value: 0,
    },
    variation: {
      type: 'number',
      inputType: 'slider',
      value: 0,
      min: 0,
      max: 1,
      step: 0.05,
    },
  },
};

export default node;
