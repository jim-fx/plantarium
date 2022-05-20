import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Shape',
  type: 'shape',
  outputs: ['shape'],
  meta: {
    description: `The shape node outputs a single shape which you can plug into the leaf node.`
  },
  parameters: {
    value: {
      type: 'shape',
      internal: true,
      label: false,
      value: [
        { x: 1, y: 0, pinned: true },
        { x: 0.5, y: 0.5, pinned: true },
        { x: 1, y: 1, pinned: true },
      ],
    },
  },
  computeValue(parameter) {
    return parameter.value;
  },
});

