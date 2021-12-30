const template: SettingsTemplate = {
  enableSync: {
    type: 'boolean',
    defaultValue: false,
  },
  useRandomSeed: {
    type: 'boolean',
    defaultValue: false,
  },
  theme: {
    type: 'select',
    values: ['dark', 'light'],
    defaultValue: 'dark',
  },
  debug: {
    options: {
      //reportError: {
        //type: 'boolean',
        //defaultValue: false,
      //},
      showLogs: {
        type: "boolean",
        defaultValue: false
      },
      renderPerf: {
        type: "boolean",
        defaultValue: false,
      },
      generatePerf: {
        type: "boolean",
        defaultValue: false,
      },
      pd: {
        type: 'boolean',
        defaultValue: false,
      },
      skeleton: {
        type: 'boolean',
        defaultValue: false,
      },
      wireframe: {
        type: 'boolean',
        defaultValue: false,
      },
      logLevel: {
        type: 'number',
        min: 0,
        max: 2,
        defaultValue: 1,
      },
    },
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
        step: 1,
        defaultValue: 8,
      },
      resY: {
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        defaultValue: 16,
      },
      scale: {
        type: 'number',
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 1,
      },
    },
  },
  leafRes: {
    type: 'number',
    min: 3,
    max: 12,
    step: 1,
    defaultValue: 2,
  },
  stemResX: {
    type: 'number',
    min: 3,
    max: 32,
    step: 1,
    defaultValue: 3,
  },
  stemResY: {
    type: 'number',
    min: 3,
    max: 64,
    step: 1,
    defaultValue: 32,
  },
};

export default template;
