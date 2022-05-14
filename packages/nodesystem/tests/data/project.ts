export default {
  meta: {

  },
  nodes: [
    {
      attributes: {
        pos: {
          x: 127,
          y: -46,
        },
        type: 'output',
        id: '0',
        refs: [],
      },
      state: {},
    },
    {
      attributes: {
        pos: {
          x: -15,
          y: -59,
        },
        type: 'math',
        id: '1',
        refs: [
          {
            id: '0',
            out: 0,
            in: 'input',
          },
        ],
      },
      state: {
        mode: 'multiply',
        a: 0,
        b: 0,
      },
    },
    {
      attributes: {
        pos: {
          x: -157,
          y: -120,
        },
        type: 'number',
        id: '2',
        refs: [
          {
            id: '1',
            out: 0,
            in: 'a',
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
          x: -159,
          y: 48,
        },
        type: 'number',
        id: '3',
        refs: [
          {
            id: '1',
            out: 0,
            in: 'b',
          },
        ],
      },
      state: {
        value: 5,
      },
    },
  ],
};
