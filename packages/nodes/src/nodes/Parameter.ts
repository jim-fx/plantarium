const node: PlantNode = {
  name: 'Parameter',
  type: 'parameter',
  outputs: [ValueType.Parameter],
  parameters: {
    value: {
      type: 'number',
      value: 0,
    },
    variation: {
      type: 'number',
      value: 0,
    },
  },
  computeNode(parameters) {
    return {
      type: 'parameter',
      parameters,
    };
  },
};

export default node;
