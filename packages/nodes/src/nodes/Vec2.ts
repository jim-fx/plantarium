import { typeCheckNode } from "../types";

export default typeCheckNode({
  title: 'Vec2',
  type: 'vec2',
  outputs: ['vec2'],
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
  },
  compute(params, _, alpha) {
    return { x: params.x(alpha), y: params.y(alpha) }
  }
});
