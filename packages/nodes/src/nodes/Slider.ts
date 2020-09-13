import { PlantNode } from '@plantarium/types';

const node: PlantNode = {
  title: 'Slider',
  type: 'slider',
  outputs: ['param'],
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
