const template: SettingsTemplate = {
  enableSync: {
    type: 'boolean',
    value: false
  },
  useRandomSeed: {
    type: 'boolean',
    defaultValue: false
  },
  theme: {
    type: 'select',
    values: ['dark', 'light'],
    value: 'dark',
    inputType: "tab"
  },
  debug: {
    onlyDev: true,
    options: {
      //reportError: {
      //type: 'boolean',
      //defaultValue: false,
      //},

      showNodeUpdates: {
        type: 'boolean',
        defaultValue: false
      },
      renderPerf: {
        type: 'boolean',
        defaultValue: false
      },
      generatePerf: {
        type: 'boolean',
        defaultValue: false
      },
      pd: {
        type: 'boolean',
        defaultValue: false
      },
      skeleton: {
        type: 'boolean',
        defaultValue: false
      },
      wireframe: {
        type: 'boolean',
        defaultValue: false
      },
      logLevel: {
        type: 'number',
        min: 0,
        max: 2,
        defaultValue: 1
      }
    }
  },
  background: {
    options: {
      grid: {
        label: 'Show Grid',
        type: 'boolean',
        defaultValue: false
      },
      ground: {
        label: 'Show Ground',
        type: 'boolean',
        defaultValue: true
      },
      resX: {
        onlyDev: true,
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        defaultValue: 8
      },
      resY: {
        onlyDev: true,
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        defaultValue: 16
      },
      scale: {
        type: 'number',
        min: 0,
        max: 5,
        step: 0.1,
        defaultValue: 1
      }
    }
  },
  leafRes: {
    onlyDev: true,
    type: 'number',
    min: 3,
    max: 12,
    step: 1,
    defaultValue: 2
  },
  stemResX: {
    onlyDev: true,
    type: 'number',
    min: 3,
    max: 32,
    step: 1,
    defaultValue: 3
  },
  stemResY: {
    onlyDev: true,
    type: 'number',
    min: 3,
    max: 64,
    step: 1,
    defaultValue: 32
  },
  isDev: {
    label: 'Advanced',
    type: 'boolean',
    defaultValue: false
  }
};

export default template;
