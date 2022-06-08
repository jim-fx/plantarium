import { convertInstancedGeometry, instanceGeometry, join, leaf, rotateMesh3D } from '@plantarium/geometry';
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
      value: defaultValue,
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
      type: "vec2",
      inputType: "float",
      value: { x: 1, y: 1 }
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

  computeValue(params, ctx) {

    const curvature = params.curvature();

    const geometry = leaf(params.shape(), {
      res: ctx.getSetting('leafRes') || 2,
      xCurvature: curvature.x,
      yCurvature: curvature.y,
    });

    const amount = params.amount()

    const offset = new Float32Array(amount * 3);
    const scale = new Float32Array(amount * 3);
    const rotation = new Float32Array(amount * 3);

    for (let i = 0; i < amount; i++) {

      const alpha = i / amount;

      const _offset = params.offset(alpha);
      offset[i * 3 + 0] = _offset.x * alpha;
      offset[i * 3 + 1] = _offset.y * alpha;
      offset[i * 3 + 2] = _offset.z * alpha;

      const _scale = params.scale(alpha)
      scale[i * 3 + 0] = _scale.x;
      scale[i * 3 + 1] = 1;
      scale[i * 3 + 2] = _scale.y;

      const angle = params.angle(alpha);
      const rot = params.rotation(alpha)
      rotation[i * 3 + 0] = rot.x + alpha * angle.x * -1;
      rotation[i * 3 + 1] = alpha * angle.y * Math.PI * 2;
      rotation[i * 3 + 2] = rot.y + alpha * angle.z;

    }

    const instances = instanceGeometry(geometry, { offset, scale, rotation })

    const geo = convertInstancedGeometry(instances)

    return join(...geo);

  },
});

