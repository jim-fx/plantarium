import { PlantNode } from '@types';

const node: PlantNode = {
  name: 'Output',
  type: 'output',
  outputs: [],
  state: {
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
