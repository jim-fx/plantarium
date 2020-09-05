const dev = {
  meta: {
    lastSaved: Date.now(),
    transform: { x: 0, y: 0, s: 1 },
  },
  nodes: [
    {
      attributes: { pos: { x: 0, y: 0 }, type: 'output', id: '0', refs: [] },
      state: {},
    },
    {
      attributes: {
        pos: { x: -150, y: 100 },
        type: 'vec3',
        id: '1',
        refs: [{ id: '0', in: 'dims' }],
      },
      state: { x: 1, y: 1, z: 1 },
    },
    {
      attributes: {
        pos: { x: -150, y: -100 },
        id: '2',
        name: 'Color',
        type: 'Color',
        refs: [{ id: '0', in: 'color' }],
      },
      state: { r: 0.6, g: 0.6, b: 1 },
    },
    {
      attributes: {
        pos: { x: -300, y: 100 },
        id: '3',
        name: 'Slider',
        type: 'Slider',
        refs: [{ id: '1', in: 'x' }],
      },
      state: { value: 0.5 },
    },
  ],
};

const dev2 = {
  meta: { transform: { x: 0, y: 0, s: 1 } },
  nodes: [
    {
      attributes: {
        pos: { x: -100, y: 0 },
        type: 'stem',
        id: '1',
        refs: [{ id: '0', in: 'main' }],
      },
      state: { height: 5, amount: 1 },
    },
    {
      attributes: { pos: { x: 0, y: 0 }, type: 'output', id: '0', refs: [] },
    },
  ],
};

export default dev2;
