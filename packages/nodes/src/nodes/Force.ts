import { applyForceToSkeleton } from '@plantarium/geometry';
import { logger } from '@plantarium/helpers';
import { PlantStem } from '@plantarium/types';
import { typeCheckNode } from '../types';
const log = logger('nodes.noise');

export default typeCheckNode({
  title: 'Force',
  type: 'force',
  outputs: ['plant'],

  meta: {
    description: `Applies a radial force to a plant`
  },

  parameters: {
    input: {
      type: 'plant',
      label: 'plant',
      external: true,
      required: true
    },
    type: {
      type: "select",
      internal: true,
      values: ["radial", "directional"],
      value: "radial"
    },
    origin: {
      type: 'vec3',
      value: { x: 0, y: 0, z: 0 },
    },
    strength: {
      type: 'number',
      min: 0,
      max: 2,
      step: 0.01,
      value: 0.5,
    },
    distance: {
      type: 'number',
      hidden: true,
      min: 0,
      max: 4,
      step: 0.01,
      value: 1,
    },

  },

  compute(parameters) {
    log("computeSkeleton", parameters);

    const { stems, instances } = parameters.input();

    const maxDepth = Math.max(...stems.map(s => s.depth));

    stems.forEach((stem: PlantStem) => {
      const strength = parameters.strength();
      const distance = parameters.distance();
      const origin = parameters.origin();
      if (stem.depth === maxDepth) {
        stem.skeleton = applyForceToSkeleton(stem.skeleton, origin, strength, distance)
      }
    });

    return {
      stems,
      instances
    };
  },
});

