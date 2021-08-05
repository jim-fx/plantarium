export default {
  meta: {
    lastSaved: 0,
  },
  nodes: [
    {
      attributes: {
        pos: {
          x: 146,
          y: -1,
        },
        type: 'output',
        id: '0',
      },
    },
    {
      attributes: {
        pos: {
          x: 27,
          y: -1,
        },
        type: 'math',
        id: '1',
        refs: [
          {
            id: '0',
            out: 0,
            in: 0,
          },
        ],
      },
      state: {
        mode: 'multiply',
      },
    },
    {
      attributes: {
        pos: {
          x: -80,
          y: -60,
        },
        type: 'number',
        id: '2',
        refs: [
          {
            id: '1',
            out: 0,
            in: 0,
          },
        ],
      },
      state: {
        value: 5,
      },
    },
    {
      attributes: {
        pos: {
          x: -80,
          y: 60,
        },
        type: 'number',
        id: '3',
        refs: [
          {
            id: '1',
            out: 0,
            in: 1,
          },
        ],
      },
      state: {
        value: 5,
      },
    },
  ],
};
