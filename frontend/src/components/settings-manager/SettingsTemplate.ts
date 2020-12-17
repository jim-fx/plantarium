const template: SettingsTemplate = {
  enableSync: {
    type: 'boolean',
    defaultValue: false,
  },
  debugPd: {
    type: 'boolean',
    defaultValue: false,
  },
  debugSkeleton: {
    type: 'boolean',
    defaultValue: false,
  },
  useRandomSeed: {
    type: 'boolean',
    defaultValue: false,
  },
  ground: {
    options: {
      enabled: {
        type: 'boolean',
        defaultValue: true,
      },
      resX: {
        type: 'number',
        min: 8,
        max: 64,
        steps: 1,
        defaultValue: 8,
      },
      resY: {
        type: 'number',
        min: 8,
        max: 64,
        steps: 1,
        defaultValue: 16,
      },
      scale: {
        type: 'number',
        min: 0,
        max: 5,
        steps: 0.1,
        defaultValue: 1,
      },
    },
  },
  stemResX: {
    type: 'number',
    min: 3,
    max: 16,
    steps: 1,
    defaultValue: 16,
  },
  stemResY: {
    type: 'number',
    min: 3,
    max: 16,
    steps: 1,
    defaultValue: 32,
  },
};

export default template;
