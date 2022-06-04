import { leaf } from '@plantarium/geometry';
import { typeCheckNode } from '../types';

const defaultValue = [
  {
    x: 0.8,
    y: 1,
    pinned: true,
  },
  {
    x: 0.62,
    y: 0.84,
    pinned: false,
  },
  {
    x: 0.54,
    y: 0.63,
    pinned: false,
  },
  {
    x: 0.38,
    y: 0.41,
    pinned: true,
  },
  {
    x: 0.44,
    y: 0.23,
    pinned: false,
  },
  {
    x: 0.64,
    y: 0.12,
    pinned: false,
  },
  {
    x: 0.98,
    y: 0.02,
    pinned: true,
  },
];

export default typeCheckNode({
  title: 'Leaf',
  type: 'leaf',
  outputs: ['model'],
  meta: {
    description: `The leaf node creates a leaf model, which you can instance along a stem with the instance node`
  },
  parameters: {
    shape: {
      type: 'shape',
      external: true,
      value: defaultValue,
      description: "Shape of the indivual leaf, you can connect a shape node here"
    },
    curvature: {
      type: 'vec2',
      inputType: "float",
      value: {
        x: 0.5,
        y: 0.2,
      },
      description: "Curvature of the leaf along x and y, you can connect a vec2 node here."
    },
  },

  computeValue(parameters, ctx) {
    const { shape, curvature } = parameters;

    const _curvature = curvature();

    return leaf(shape(), {
      res: ctx.getSetting('leafRes') || 2,
      xCurvature: _curvature.x,
      yCurvature: _curvature.y,
    });
  },
});

