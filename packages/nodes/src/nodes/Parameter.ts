const node: PlantNode = {
  title: 'Parameter',
  type: 'parameter',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      value: 0,
    },
    variation: {
      type: 'number',
      inputType: 'slider',
      value: 0,
      min: 0,
      max: 1,
      step: 0.05,
    },
  },
  computeValue(parameters, ctx) {
    const { value = 0, variation = 0 } = parameters;

    if (variation) {
      const v = value + ctx.n1d(200) * variation * Math.max(value, 1);
      // console.log('Parameter ', v);
      return v;
    }
    return value;
  },
};

export default node;
