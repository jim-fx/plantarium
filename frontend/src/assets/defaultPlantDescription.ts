export default {
  meta: {
    name: 'default',
    author: 'jimfx',
  },
  stem: {
    diameter: {
      value: 0.016,
      variation: 0.2,
    },
    originOffset: {
      value: 0.118,
      variation: 0.154,
    },
    originAngle: {
      value: 10.651,
    },
    originRotation: {
      value: 325.917,
    },
    noiseStrength: {
      value: 0,
    },
    size: {
      value: 1.946,
      variation: 0.503,
    },
    amount: 3,
    gravity: 0.421,
  },
  branches: {
    enable: true,
    diameter: {
      value: 0.633,
    },
    length: {
      value: 0.777,
      variation: 0.45,
      curve: [
        {
          x: 0,
          y: 0,
          locked: true,
        },
        {
          x: 0.291,
          y: 0.78,
        },
        {
          x: 1,
          y: 1,
          locked: true,
        },
      ],
    },
    angle: {
      value: 30,
    },
    lowestBranch: {
      value: 0.379,
    },
    offset: {
      value: 0.882,
    },
    rotation: {
      value: 0,
    },
    amount: 15,
    noiseScale: 1,
    noiseStrength: {
      value: 0,
    },
    gravity: 0.509,
  },
  leaves: {
    enable: true,
    amount: 12,
    onBranches: true,
    onStem: false,
    angle: {
      value: 1,
    },
    offset: {
      value: 1,
    },
    rotation: {
      value: 1,
    },
    size: {
      value: 0.249,
    },
    xCurvature: {
      value: 1,
    },
    yCurvature: {
      value: 1,
    },
    shape: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 0.21,
        y: 0.275,
      },
      {
        x: 0.3,
        y: 0.48,
      },
      {
        x: 0.308,
        y: 0.645,
      },
      {
        x: 0.213,
        y: 0.83,
      },
      {
        x: 0.01,
        y: 1,
      },
    ],
    gravity: 0.355,
  },
};
