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
    id: 'debugSkeleton',
    type: 'boolean',
  },
  {
    id: 'useRandomSeed',
    type: 'boolean',
  },
  {
    id: 'ground',
    type: 'section',
    options: [
      {
        id: 'resX',
        type: 'number',
        min: 8,
        max: 64,
        steps: 1,
      },
      {
        id: 'scale',
        type: 'number',
        min: 0,
        max: 5,
        steps: 0.1,
      },
      {
        id: 'resY',
        type: 'number',
        min: 8,
        max: 64,
        steps: 1,
      },
    ],
  },
  {
    id: 'stemResX',
    type: 'number',
    min: 3,
    max: 16,
    steps: 1,
    value: 16,
  },
  {
    id: 'stemResY',
    type: 'number',
    min: 3,
    max: 16,
    steps: 1,
    value: 32,
  },
];
