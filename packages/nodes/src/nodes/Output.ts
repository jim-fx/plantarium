import { PlantNode } from '@types';

const node: PlantNode = {
  title: 'Output',
  type: 'output',
  outputs: [],
  parameters: {
    main: {
      type: 'plant',
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
