import {
  calculateNormals,
  instanceGeometry,
  interpolateSkeleton,
  interpolateSkeletonVec,
  leaf,
  normalize2D,
} from '@plantarium/geometry';
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
  parameters: {
    input: {
      type: 'plant',
      required: true,
      external: true,
    },
    size: {
      type: 'number',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0.2,
    },
    shape: {
      type: 'shape',
      external: true,
      value: defaultValue,
    },
    lowestLeaf: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
    },
    curvature: {
      external: true,
      type: 'vec2',
      value: {
        x: 0.5,
        y: 0.2,
      },
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 10,
    },
  },

  computeStem(parameters) {

    const { stems } = parameters.input();

    const maxDepth = Math.max(...stems.map(s => s.depth))

    const instances = stems.map((stem, i) => {
      const alpha = i / stems.length;

      if (stem.depth !== maxDepth) return;

      const amount = parameters.amount(alpha);

      if (!amount) return

      const offset = new Float32Array(amount * 3);
      const scale = new Float32Array(amount * 3);
      const rotation = new Float32Array(amount * 3);

      for (let i = 0; i < amount; i++) {
        const _alpha = i / (amount - 1);
        const size = parameters.size(1 - _alpha);
        const lowestLeaf = parameters.lowestLeaf(_alpha);

        const a = lowestLeaf + (1 - lowestLeaf) * _alpha - 0.001;
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
        rotation[i * 3 + 1] =
          angleRadians - (Math.PI / 2) * (i % 2 === 0 ? -1 : 1);
        rotation[i * 3 + 2] = 0;
      }

      return {
        offset,
        scale,
        rotation,
      };
    }).filter(v => !!v);

    return {
      stems,
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

