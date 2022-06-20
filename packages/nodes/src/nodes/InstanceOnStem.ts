import { instanceGeometry, interpolateSkeleton, interpolateSkeletonVec } from "@plantarium/geometry";
import { InstancedGeometry } from "@plantarium/types";
import { quat, vec2, vec3 } from "gl-matrix";
import { findMaxDepth } from "../helpers";
import { typeCheckNode } from "../types";


const upVec = vec3.fromValues(0, 1, 0);

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
      type: "number",
      min: 0,
      max: 1,
      inputType: "float",
      hidden: true,
      value: 0
    },
    alternateRotation: {
      type: "number",
      min: 0,
      max: 1,
      inputType: "float",
      hidden: true,
      value: 1
    },
    size: {
      type: 'number',
      min: 0,
      max: 3,
      step: 0.05,
      value: 0.2,
      description: "Size of the individual leaves."
    },
    instanceRange: {
      type: 'vec2',
      inputType: "range",
      value: { x: 0.2, y: 1 },
      description: "The range where instances are placed"
    },
    amount: {
      type: 'number',
      min: 0,
      max: 20,
      value: 10,
      description: "How many leaves should be placed."
    },
    rotation: {
      type: "vec3",
      inputType: "float",
      min: -1,
      max: 1,
      value: {
        x: 0,
        y: 0,
        z: 0
      }
    },
    offsetBySize: {
      type: "boolean",
      internal: true,
      value: true,
    },
    depth: {
      type: 'number',
      hidden: true,
      min: 1,
      value: 1,
      description: "On how many layern of branches should we place leaves."
    },
  },
  compute(parameters, ctx) {

    const input = parameters.input();

    const geometry = parameters.model();

    const maxDepth = findMaxDepth(input);
    const depth = parameters.depth()

    const offsetBySize = parameters.offsetBySize

    const instances = input.stems.map((stem, j) => {

      if (stem.depth < (maxDepth - depth + 1)) return;

      const alpha = j / input.stems.length;

      const amount = Math.max(0, parameters.amount(alpha));
      if (!amount) return

      const offset = new Float32Array(amount * 3);
      const scale = new Float32Array(amount * 3);
      const rotation = new Float32Array(amount * 4);
      const baseAlpha = new Float32Array(amount);

      const { x: lowestInstance, y: highestInstance } = parameters.instanceRange(alpha);

      let totalSize = 0;
      const sizes = new Array(amount).fill(null).map((v, i) => {
        const _alpha = amount === 1 ? 0 : i / (amount - 1);
        const size = parameters.size(1 - _alpha);
        totalSize += size;
        return size;
      })

      let prevAlpha = 0;
      for (let i = 0; i < amount; i++) {
        const size = sizes[i];
        let _alpha = 0;
        if (amount === 1) {
          _alpha = 0;
        } else if (offsetBySize) {
          _alpha = size / totalSize + prevAlpha;
        } else {
          _alpha = i / amount;
        }
        prevAlpha = _alpha;

        const a = lowestInstance + (highestInstance - lowestInstance) * _alpha - 0.001;

        baseAlpha[i] = a;

        const [x, y, z] = interpolateSkeleton(stem.skeleton, a);
        const [vx, vy, vz] = interpolateSkeletonVec(stem.skeleton, a);

        const stemVec = vec3.fromValues(vx, vy, vz);

        ctx.debugVec3([vx, 0, vz], [x, y, z], 0.1);

        offset[i * 3 + 0] = x;
        offset[i * 3 + 1] = y;
        offset[i * 3 + 2] = z;

        scale[i * 3 + 0] = size;
        scale[i * 3 + 1] = size;
        scale[i * 3 + 2] = size;

        const stemV2 = vec2.fromValues(vx, vz)
        let angle = vec2.angle(vec2.fromValues(0, 1), stemV2);
        if (stemV2[0] < 0) angle = -angle;

        const rot = parameters.rotation(a);
        const alignRotation = parameters.alignRotation(_alpha);

        let xRotation = rot.x
        let yRotation = angle + rot.y;

        const alternateRotation = parameters.alternateRotation(_alpha);

        if (alternateRotation) {
          if (i % 2 === 0) {
            yRotation -= alternateRotation * rot.y * 2;
            // xRotation = -xRotation;
          }
        }

        const q = quat.create()

        quat.rotateY(q, q, yRotation);
        quat.rotateX(q, q, xRotation);
        quat.rotateZ(q, q, rot.z);

        if (alignRotation) {

          const d = vec3.dot(upVec, stemVec);

          if (d > 0.0001 && d < 0.9999) {
            const sq = quat.create();
            quat.rotationTo(sq, upVec, stemVec);
            const aq = quat.create()
            quat.add(aq, q, sq);
            quat.slerp(q, q, aq, alignRotation);
          }
        }

        quat.normalize(q, q)

        const v = vec3.fromValues(0, 0, 1);
        vec3.transformQuat(v, v, q);
        ctx.debugVec3([...v], [x, y, z], 0.7);

        rotation[i * 4 + 0] = q[0];
        rotation[i * 4 + 1] = q[1];
        rotation[i * 4 + 2] = q[2];
        rotation[i * 4 + 3] = q[3];

      }

      return {
        offset,
        scale,
        rotation,
        id: stem.id + "-" + j,
        baseAlpha,
        depth: stem.depth
      };
    }).filter(v => !!v).map(inst => instanceGeometry(geometry, inst));

    if (input.instances) {
      instances.push(...input.instances)
    }

    return {
      stems: input.stems,
      instances: instances as InstancedGeometry[],
    };

  }
})

