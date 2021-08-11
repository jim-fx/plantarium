const node: PlantNode = {
  title: 'Shape',
  type: 'shape',
  outputs: ['shape'],
  parameters: {
    value: {
      type: 'shape',
      inputType: 'shape',
      internal: true,
      label: false,
      value: [
        { x: 0, y: 1, pinned: true },
        { x: 1, y: 0, pinned: true },
      ],
    },
  },
};

export default node;
