const dev = {
  meta: {
    lastSaved: Date.now(),
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
            in: "input",
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
            in: "a",
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
          x: -80,
          y: 60,
        },
        type: 'number',
        id: '3',
        refs: [
          {
            id: '1',
            out: 0,
            in: "b",
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
          x: -280,
          y: 0,
        },
        type: 'number',
        id: '0',
        refs: [
          {
            id: '1',
            out: 0,
            in: "a",
          },
          {
            id: '1',
            out: 0,
            in: "b",
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
            x: -200 + x * 80,
            y: y * 60,
          },
          type: 'math',
          refs: [
            {
              id: (i + 1).toString(),
              out: 0,
              in: "a",
            },
            {
              id: (i + 1).toString(),
              out: 0,
              in: "b",
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
      x: -200 + gridSize * 80,
      y: (gridSize - 1) * 60,
    },
    type: 'output',
    refs: [],
  },
  state: {
    value: 2,
  },
});

export { dev, stressTest };
