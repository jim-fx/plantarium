import type { SettingsTemplate } from "$lib/types";

const template: SettingsTemplate = {
  enableSync: {
    type: 'boolean',
    value: false
  },
  useRandomSeed: {
    type: 'boolean',
    value: false
  },
  theme: {
    type: 'select',
    inputType: "tab",
    values: ['dark', 'light'],
    value: 'dark',
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
        value: false
      },
      renderPerf: {
        type: 'boolean',
        value: false
      },
      generatePerf: {
        type: 'boolean',
        value: false
      },
      pd: {
        type: 'boolean',
        value: false
      },
      skeleton: {
        type: 'boolean',
        value: false
      },
      wireframe: {
        type: 'boolean',
        value: false
      },
      logLevel: {
        type: 'number',
        min: 0,
        max: 2,
        value: 1
      }
    }
  },
  background: {
    options: {
      grid: {
        label: 'Show Grid',
        type: 'boolean',
        value: false
      },
      ground: {
        label: 'Show Ground',
        type: 'boolean',
        value: true
      },
      resX: {
        onlyDev: true,
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        value: 8
      },
      resY: {
        onlyDev: true,
        type: 'number',
        min: 8,
        max: 64,
        step: 1,
        value: 16
      },
      scale: {
        type: 'number',
        min: 0,
        max: 5,
        step: 0.1,
        value: 1
      }
    }
  },
  leafRes: {
    onlyDev: true,
    type: 'number',
    min: 3,
    max: 12,
    step: 1,
    value: 2
  },
  stemResX: {
    onlyDev: true,
    type: 'number',
    min: 3,
    max: 32,
    step: 1,
    value: 3
  },
  stemResY: {
    onlyDev: true,
    type: 'number',
    min: 3,
    max: 64,
    step: 1,
    value: 32
  },
  isDev: {
    label: 'Advanced',
    type: 'boolean',
    value: false
  }
};

export default template;
