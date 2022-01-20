const node: PlantNode = {
  title: 'Random',
  type: 'random',
  outputs: ['number'],
  parameters: {
    min: {
      type: 'number',
      value: 0,
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.05,
    },
    max: {
      type: 'number',
      inputType: 'slider',
      value: 1,
      min: 0,
      max: 1,
      step: 0.05,
    },
  },
  computeValue(parameters, ctx) {
    const { min = 0, max = 1 } = parameters;

    if (max) {
      const v = min + ctx.n1dn(200) * Math.abs(max - min);
      return v;
    }
    return 0;
  },
};

export default node;
