import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Random',
  type: 'random',
  outputs: ['number'],
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
  computeValue(parameters, ctx, alpha) {

    const max = parameters.max();
    const min = parameters.min()

    if (max) {
      const v = min + ctx.n1dn(200 + alpha * 1000) * Math.abs(max - min);
      return v;
    }
    return 0;
  },
});

