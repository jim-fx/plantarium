const dev = {
  meta: {
    lastSaved: Date.now(),
    transform: {
      x: 0,
      y: 0,
      s: 1,
    },
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
        value: 2,
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
        value: 2,
      },
    },
  ],
};

const stressTest = {
  meta: {
    lastSaved: Date.now(),
    transform: {
      x: 0,
      y: 0,
      s: 1,
    },
  },
  nodes: [
    {
      attributes: {
        pos: {
          x: -300,
          y: 0,
        },
        type: 'number',
        id: '0',
        refs: [
          {
            id: '1',
            out: 0,
            in: 'a',
          },
          {
            id: '1',
            out: 0,
            in: 'b',
          },
        ],
      },
      state: {
        value: 2,
      },
    },
  ],
};

const gridSize = 12;
const grid = new Array(gridSize)
  .fill(null)
  .map((_n) => new Array(gridSize).fill(null))
  .map((row, y) =>
    row.map((_cell, x) => {
      const i = y * gridSize + x + 1;
      const id = i.toString();

      return {
        attributes: {
          id,
          pos: {
            x: -200 + x * 100,
            y: y * 150,
          },
          type: 'math',
          refs: [
            {
              id: (i + 1).toString(),
              out: 0,
              in: 'a',
            },
            {
              id: (i + 1).toString(),
              out: 0,
              in: 'b',
            },
          ],
        },
        state: {
          mode: 'add',
        },
      };
    }),
  );

stressTest.nodes.push(...grid.flat().flat(), {
  attributes: {
    id: (gridSize * gridSize + 1).toString(),
    pos: {
      x: -200 + gridSize * 100,
      y: (gridSize - 1) * 150,
    },
    type: 'output',
    refs: [],
  },
  state: {
    value: 2,
  },
});

stressTest.nodes[stressTest.nodes.length - 2].attributes.refs = [
  {
    id: (gridSize * gridSize + 1).toString(),
    out: 0,
    in: 'input',
  },
];

export const tutorial = {
  meta: {
    lastSaved: 1652709738865,
  },
  nodes: [],
  history: {
    steps: [],
    index: -1,
  },
};

export { dev, stressTest };
