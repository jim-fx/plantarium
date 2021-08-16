const node: PlantNode = {
  title: 'Slider',
  type: 'slider',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      label: false,
      inputType: 'slider',
      internal: true,
      min: 0,
      max: 1,
      step: 0.01,
      value: 0,
    },
  },
  computeValue(parameters) {
    return parameters.value;
  },
};

export default node;
