import {
  calculateNormals,
  instanceGeometry,
  interpolateSkeleton,
  interpolateSkeletonVec,
  leaf,
  normalize2D,
} from '@plantarium/geometry';
import { findMaxDepth } from '../helpers';
import { typeCheckNode } from '../types';
// import { logger } from '@plantarium/helpers';
// const log = logger('nodes.leaf');

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
  outputs: ['plant'],
  meta: {
    description: `The leaf node instances leafs along branches or stems, you can override the shape of the leaf by plugging a shape node into the shape input.`
  },
  parameters: {
    input: {
      type: 'plant',
      label: "plant",
      required: true,
      external: true,
      description: "The input the leafs will be placed on."
    },
    size: {
      type: 'number',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0.2,
      description: "Size of the individual leaves."
    },
    shape: {
      type: 'shape',
      external: true,
      hidden: true,
      value: defaultValue,
      description: "Shape of the indivual leaf, you can connect a shape node here"
    },
    lowestLeaf: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
      description: "The lowest leaf on the stem."
    },
    highestLeaf: {
      type: 'number',
      hidden: true,
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
      description: "The highest leaf on the stem."
    },
    curvature: {
      external: true,
      hidden: true,
      type: 'vec2',
      value: {
        x: 0.5,
        y: 0.2,
      },
      description: "Curvature of the leaf along x and y, you can connect a vec2 node here."
    },
    depth: {
      type: 'number',
      hidden: true,
      min: 1,
      value: 1,
      description: "On how many layern of branches should we place leaves."
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 10,
      description: "How many leaves should be placed."
    },
  },

  computeStem(parameters) {

    const input = parameters.input();

    const maxDepth = findMaxDepth(input);
    const depth = parameters.depth()

    const instances = input.stems.map((stem, j) => {
      const alpha = j / input.stems.length;

      if (stem.depth < (maxDepth - depth + 1)) return;

      const amount = parameters.amount(alpha);

      if (!amount) return

      const offset = new Float32Array(amount * 3);
      const scale = new Float32Array(amount * 3);
      const rotation = new Float32Array(amount * 3);
      const baseAlpha = new Float32Array(amount);

      const lowestLeaf = parameters.lowestLeaf(alpha);
      const highestLeaf = parameters.highestLeaf(alpha);

      for (let i = 0; i < amount; i++) {
        const _alpha = i / (amount - 1);
        const size = parameters.size(1 - _alpha);

        const a = lowestLeaf + (highestLeaf - lowestLeaf) * _alpha - 0.001;
        baseAlpha[i] = a;
        //const isLeft = i % 2 === 0;

        const [x, y, z] = interpolateSkeleton(stem.skeleton, a);
        const [vx, _, vz] = interpolateSkeletonVec(stem.skeleton, a);

        const nv = normalize2D([vx, vz]);

        //Rotate Vector along stem by 90deg
        // const [vx, vz] = rotate2D(nv[0], nv[1], isLeft ? Math.PI : -Math.PI);

        // Find the angle of the vector
        const angleRadians = Math.atan2(-nv[0], nv[1]);

        offset[i * 3 + 0] = x;
        offset[i * 3 + 1] = y;
        offset[i * 3 + 2] = z;

        scale[i * 3 + 0] = size;
        scale[i * 3 + 1] = size;
        scale[i * 3 + 2] = size;

        rotation[i * 3 + 0] = 0;
        rotation[i * 3 + 1] = angleRadians - (Math.PI / 2) * (i % 2 === 0 ? -1 : 1);
        rotation[i * 3 + 2] = 0;

        if (a > 0.99) {
          rotation[i * 3 + 1] = angleRadians;
        }
      }

      return {
        offset,
        scale,
        rotation,
        id: stem.id + "-" + j,
        baseAlpha,
        depth: stem.depth
      };
    }).filter(v => !!v);

    if (input.instances) {
      instances.push(...input.instances)
    }

    return {
      stems: input.stems,
      instances,
    };
  },

  computeGeometry(parameters, result, ctx) {
    const { shape, input, curvature } = parameters;
    const { instances } = result;

    const _curvature = curvature();

    const geometry = leaf(shape(), {
      res: ctx.getSetting('leafRes') || 2,
      xCurvature: _curvature.x,
      yCurvature: _curvature.y,
    });

    return {
      geometry: input().geometry,
      // Here we add the resulting geometry to the instances
      instances: instances.map((inst) => instanceGeometry(geometry, inst)),
    };
  },
});

