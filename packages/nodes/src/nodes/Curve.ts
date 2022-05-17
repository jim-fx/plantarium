import { curve } from '@plantarium/helpers';
import { interpolateArray } from '@plantarium/geometry';
import { typeCheckNode } from '../types';

export default typeCheckNode({
  title: 'Curve',
  type: 'curve',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'curve',
      internal: true,
      label: false,
      value: [
        { x: 0, y: 1, pinned: true },
        { x: 1, y: 0, pinned: true },
      ],
    },
  },
  computeValue(parameters, _, alpha) {
    const values = curve.toArray(parameters.value).map((v) => v.y);
    return interpolateArray(values, 1 - alpha);
  },
});

