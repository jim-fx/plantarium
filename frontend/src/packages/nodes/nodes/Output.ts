const node: PlantNode = {
  title: 'Output',
  type: 'output',
  outputs: [],
  parameters: {
    main: {
      type: 'plant',
      label: 'plant',
      external: true,
    },
  },
  computeNode(parameters = {}) {
    return (parameters.main as unknown) as NodeResult;
  },
};

export default node;
