import { PlantNode } from '@types';

const node: PlantNode = {
  title: 'Parameter',
  type: 'parameter',
  outputs: ['param'],
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
