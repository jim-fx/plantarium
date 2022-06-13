import { typeCheckNode } from "../types"

export default typeCheckNode({
  title: 'Parameter',
  type: 'parameter',
  outputs: ['number'],
  meta: {
    description: `The parameter outputs a value with a certain random variation applied to it.`
  },
  parameters: {
    value: {
      type: 'number',
      inputType: 'float',
      value: 0,
      description: "Base value to apply variation to"
    },
    variation: {
      type: 'number',
      value: 0,
      min: 0,
      max: 1,
      step: 0.05,
      description: "How much variation should be applied to the base value"
    },
  },
  compute(parameters, ctx, alpha = 1) {

    const value = parameters.value();
    const variation = parameters.variation();

    if (variation) {
      const v = value + ctx.n1d(200 * alpha) * variation * Math.max(value, 1);
      // console.log('Parameter ', v);
      return v;
    }
    return value;
  },
});

