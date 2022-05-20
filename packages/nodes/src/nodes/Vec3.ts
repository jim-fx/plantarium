import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Vec3',
  type: 'vec3',
  outputs: ['vec3'],
  meta: {
    description: "Outputs a Vec3, you can connect a random or parameter node here to distribute stems."
  },
  parameters: {
    x: {
      label: false,
      type: 'number',
      value: 0,
      defaultValue: 0,
    },
    y: {
      label: false,
      type: 'number',
      value: 0,
      defaultValue: 0,
    },
    z: {
      label: false,
      type: 'number',
      value: 0,
      defaultValue: 0,
    },
  },
});

