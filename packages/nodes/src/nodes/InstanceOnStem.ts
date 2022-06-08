import { instanceGeometry, interpolateSkeleton, interpolateSkeletonVec, normalize2D, vec3ToRotation } from "@plantarium/geometry";
import { InstancedGeometry } from "@plantarium/types";
import { findMaxDepth } from "../helpers";
import { typeCheckNode } from "../types";

export default typeCheckNode({
  type: "instance",
  title: "Instance",
  outputs: ["plant"],
  parameters: {
    input: {
      type: "plant",
      external: true
    },
    model: {
      type: "model",
      external: true,
      required: true,
    },
    alignRotation: {
      type: "boolean",
      hidden: true,
      value: false
    },
    size: {
      type: 'number',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0.2,
      description: "Size of the individual leaves."
    },
    lowestInstance: {
      type: 'number',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0.5,
      description: "The lowest leaf on the stem."
    },
    highestInstance: {
      type: 'number',
      hidden: true,
      min: 0,
      max: 1,
      step: 0.01,
      value: 1,
      description: "The highest leaf on the stem."
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 10,
      description: "How many leaves should be placed."
    },
    depth: {
      type: 'number',
      hidden: true,
      min: 1,
      value: 1,
      description: "On how many layern of branches should we place leaves."
    },
  },
  computeStem(parameters) {

    const input = parameters.input();

    const maxDepth = findMaxDepth(input);
    const depth = parameters.depth()

    const instances = input.stems.map((stem, j) => {

      if (stem.depth < (maxDepth - depth + 1)) return;

      const alpha = j / input.stems.length;

      const amount = parameters.amount(alpha);
      if (!amount) return

      const offset = new Float32Array(amount * 3);
      const scale = new Float32Array(amount * 3);
      const rotation = new Float32Array(amount * 3);
      const baseAlpha = new Float32Array(amount);

      const lowestInstance = parameters.lowestInstance(alpha);
      const highestInstance = parameters.highestInstance(alpha);

      for (let i = 0; i < amount; i++) {
        const _alpha = amount === 1 ? 0.5 : i / (amount - 1);
        const alignRotation = parameters.alignRotation(_alpha);
        const size = parameters.size(1 - _alpha);

        const a = lowestInstance + (highestInstance - lowestInstance) * _alpha - 0.001;
        baseAlpha[i] = a;
        //const isLeft = i % 2 === 0;

        const [x, y, z] = interpolateSkeleton(stem.skeleton, a);
        const [vx, vy, vz] = interpolateSkeletonVec(stem.skeleton, a);

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


        if (alignRotation) {
          const rot = vec3ToRotation([vx, vy, vz]);
          rotation[i * 3 + 0] = rot[0];
          rotation[i * 3 + 1] = 0;
          rotation[i * 3 + 2] = rot[2];
        }

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

    return {
      stems: input.stems,
      instances: instances as InstancedGeometry[],
    };

  },
  computeGeometry(parameters, result) {
    const geometry = parameters.model();
    const input = parameters.input();
    const instances = result.instances.map(inst => instanceGeometry(geometry, inst));
    if (input.instances) instances.push(...input.instances);
    return {
      geometry: parameters.input().geometry,
      instances
    }
  }
})

