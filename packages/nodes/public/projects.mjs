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
            out: 'input',
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
            out: 'input1',
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
            out: 'input2',
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
            in: 'input1',
          },
          {
            id: '1',
            in: 'input2',
          },
        ],
      },
      state: {
        value: 2,
      },
    },
  ],
};

const gridWidth = 15;
const gridHeight = 8;
const grid = new Array(gridHeight)
  .fill(null)
  .map(() => new Array(gridWidth).fill(null))
  .map((row, y) =>
    row.map((_cell, x) => {
      const i = y * gridWidth + x + 1;
      const id = i.toString();

      return {
        attributes: {
          id,
          pos: {
            x: -200 + x * 90,
            y: y * 150,
          },
          type: 'math',
          refs: [
            {
              id: (i + 1).toString(),
              in: 'input1',
            },
            {
              id: (i + 1).toString(),
              in: 'input2',
            },
          ],
        },
        state: {
          mode: 'multiply',
        },
      };
    }),
  );

stressTest.nodes.push(...grid.flat().flat(), {
  attributes: {
    id: (gridWidth * gridHeight + 1).toString(),
    pos: {
      x: -200 + gridWidth * 90,
      y: (gridHeight - 1) * 150,
    },
    type: 'output',
    refs: [],
  },
  state: {
    value: 2,
  },
});

stressTest.nodes[stressTest.nodes.length - 2].attributes.refs[0].in = 'input';

export { dev, stressTest };
