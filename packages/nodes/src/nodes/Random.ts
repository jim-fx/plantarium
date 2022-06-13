import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Random',
  type: 'random',
  outputs: ['number'],
  meta: {
    description: "Generates random value between min and max."
  },
  parameters: {
    min: {
      type: 'number',
      value: 0,
      min: 0,
      max: 1,
      step: 0.05,
    },
    max: {
      type: 'number',
      value: 1,
      min: 0,
      max: 1,
      step: 0.05,
    },
  },
  compute(parameters, ctx, alpha) {

    const max = parameters.max(alpha);
    const min = parameters.min(alpha)

    return min + ctx.n1dn(200 + alpha * 1000) * Math.abs(max - min);
  },
});

