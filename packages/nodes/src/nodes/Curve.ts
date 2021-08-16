import { curve } from '@plantarium/helpers';
import { interpolateArray } from '@plantarium/geometry';

const node: PlantNode = {
  title: 'Curve',
  type: 'curve',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'curve',
      inputType: 'curve',
      internal: true,
      label: false,
      value: [
        { x: 0, y: 1, pinned: true },
        { x: 1, y: 0, pinned: true },
      ],
    },
  },
  computeValue(parameters, ctx, alpha) {
    const values = curve.toArray(parameters.value).map((v) => v.y);
    return interpolateArray(values, 1 - alpha);
  },
};

export default node;
