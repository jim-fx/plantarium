import { NodeResult, PlantNode } from '@plantarium/types';

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
  computeNode(parameters = {}) {
    return (parameters.main as unknown) as NodeResult;
  },
};

export default node;
