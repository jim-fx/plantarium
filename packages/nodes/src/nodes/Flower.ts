import { convertInstancedGeometry, instanceGeometry, join, leaf, rotate2D } from '@plantarium/geometry';
import { quat } from 'gl-matrix';
import { typeCheckNode } from '../types';

const defaultPetal = [
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
  title: 'Flower',
  type: 'flower',
  outputs: ['model'],
  meta: {
    description: `The flower node creates a flower model which you can instance on stems.`
  },
  parameters: {
    shape: {
      type: 'shape',
      external: true,
      value: defaultPetal,
      description: "Shape of the indivual flower leaf, you can connect a shape node here"
    },
    curvature: {
      external: true,
      type: 'vec2',
      inputType: "float",
      value: {
        x: 0.5,
        y: 0.2,
      },
      description: "Curvature of the flower leaf along x and y, you can connect a vec2 node here."
    },
    amount: {
      type: "number",
      inputType: "integer",
      min: 2,
      max: 20,
      value: 8
    },
    scale: {
      type: "vec3",
      inputType: "float",
      value: { x: 1, y: 1, z: 1 }
    },
    angle: {
      type: "vec3",
      inputType: "float",
      value: { x: 0, y: 1, z: 0 }
    },
    rotation: {
      type: "vec2",
      hidden: true,
      inputType: "float",
      value: { x: 0, y: 0 }
    },
    offset: {
      type: "vec3",
      external: true,
      value: { x: 0, y: 0, z: 0 }
    }
  },

  compute(params, ctx) {

    const curvature = params.curvature();

    const geometry = leaf(params.shape(), {
      res: ctx.getSetting('leafRes') || 2,
      xCurvature: curvature.x,
      yCurvature: curvature.y,
    });

    const amount = params.amount()

    const offset = new Float32Array(amount * 3);
    const scale = new Float32Array(amount * 3);
    const rotation = new Float32Array(amount * 4);

    for (let i = 0; i < amount; i++) {

      const alpha = i / amount;

      const _offset = params.offset(alpha);
      offset[i * 3 + 0] = _offset.x * alpha;
      offset[i * 3 + 1] = _offset.y * alpha;
      offset[i * 3 + 2] = _offset.z * alpha;

      const _scale = params.scale(alpha)
      scale[i * 3 + 0] = _scale.x;
      scale[i * 3 + 1] = _scale.y;
      scale[i * 3 + 2] = _scale.z;

      const angle = params.angle(alpha);
      const rot = params.rotation(alpha)
      const q = quat.create()

      quat.rotateY(q, q, rot.y + angle.y * alpha * Math.PI * 2);
      quat.rotateX(q, q, rot.x + angle.x);
      quat.rotateZ(q, q, angle.z);

      rotation[i * 4 + 0] = q[0]
      rotation[i * 4 + 1] = q[1]
      rotation[i * 4 + 2] = q[2]
      rotation[i * 4 + 3] = q[3]

      // const vec = rotate2D([1, 0], angle.y);
      //
      // rotation[i * 3 + 0] = vec[0];
      // rotation[i * 3 + 2] = vec[1];

    }

    const instances = instanceGeometry(geometry, { offset, scale, rotation })

    const geo = convertInstancedGeometry(instances)

    return join(...geo);
  },
});

