const node: PlantNode = {
  name: 'Slider',
  type: 'slider',
  outputs: [ValueType.Parameter],
  parameters: {
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
  computeNode(parameters) {
    return {
      type: 'slider',
      parameters,
    };
  },
};

export default node;
