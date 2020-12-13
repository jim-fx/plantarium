const node: PlantNode = {
  title: 'Curve',
  type: 'curve',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'curve',
      inputType: 'curve',
      internal: true,
      value: [
        { x: 0, y: 1, pinned: true },
        { x: 1, y: 0, pinned: true },
      ],
    },
  },
};

export default node;
