export default [
  {
    id: 'enableSync',
    type: 'boolean',
  },
  {
    id: 'debugPd',
    type: 'boolean',
  },
  {
    id: 'enableRandomSeed',
    type: 'boolean',
  },
  {
    id: 'ground_scale',
    type: 'number',
    min: 0,
    max: 5,
    steps: 0.1,
  },
  {
    id: 'stemResX',
    type: 'number',
    min: 3,
    max: 16,
    steps: 1,
  },
  {
    id: 'ground_resX',
    type: 'number',
    min: 8,
    max: 64,
    steps: 1,
  },
  {
    id: 'ground_resY',
    type: 'number',
    min: 8,
    max: 64,
    steps: 1,
  },
];
