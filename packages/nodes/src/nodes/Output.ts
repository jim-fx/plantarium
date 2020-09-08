const node: PlantNode = {
  name: 'Output',
  type: 'output',
  outputs: [],
  parameters: {
    main: {
      type: 'pd',
      label: 'plant',
      internal: false,
    },
  },
  computeNode(parameters) {
    return {
      type: 'output',
      parameters,
    };
  },
};

export default node;
