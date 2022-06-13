import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Slider',
  type: 'slider',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      label: false,
      internal: true,
      min: 0,
      max: 1,
      step: 0.01,
      value: 0,
    },
  },
  compute(parameters) {
    return parameters.value;
  },
});

