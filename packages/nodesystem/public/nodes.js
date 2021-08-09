//Boolean Operations
const boolops = {
  title: 'Boolops',
  type: 'boolops',
  outputs: ['boolean'],
  parameters: {
    mode: {
      type: 'select',
      values: ['and', 'or'],
      internal: true,
    },
    a: {
      type: 'boolean',
      defaultValue: false,
    },
    b: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  compute({ a, b, mode }) {
    if (mode === 'and') return a && b;
    if (mode === 'or') return a || b;
    return false;
  },
};

//Compare numbers
const compare = {
  title: 'compare',
  outputs: ['boolean'],
  parameters: {
    mode: {
      type: 'select',
      values: ['>', '<', '='],
      internal: true,
    },
    a: {
      type: 'number',
      defaultValue: 0,
    },
    b: {
      type: 'number',
      defaultValue: 0,
    },
  },
  compute: function ({ a, b, mode }) {
    switch (mode) {
      case '=':
        return a === b;
      case '>':
        return a > b;
      case '<':
        return a < b;
    }
    return false;
  },
};

//Picker
const picker = {
  title: 'picker',
  outputs: ['number'],
  parameters: {
    selectFirst: {
      type: 'boolean',
    },
    inputA: {
      type: 'number',
    },
    inputB: {
      type: 'number',
    },
  },
  compute: function ({ selectFirst = true, input1 = 0, input2 = 0 }) {
    return selectFirst ? input1 : input2;
  },
};

const slider = {
  title: 'Slider',
  type: 'slider',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      label: false,
      inputType: 'slider',
      internal: true,
      min: 0,
      max: 1,
      step: 0.01,
      value: 0,
    },
  },
  computeNode(parameters) {
    return {
      type: 'slider',
      parameters,
    };
  },
};

export default [boolops, compare, picker, slider];
