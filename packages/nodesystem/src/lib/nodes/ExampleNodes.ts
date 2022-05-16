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
      value: false,
    },
    b: {
      type: 'boolean',
      value: false,
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
  type: "compare",
  outputs: ['boolean'],
  parameters: {
    mode: {
      type: 'select',
      values: ['>', '<', '='],
      value: "=",
      internal: true,
    },
    a: {
      type: 'number',
      value: 0,
    },
    b: {
      type: 'number',
      value: 0,
    },
  },
  compute: function({ a, b, mode }) {
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
  type: "picker",
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
  compute: function({ selectFirst = true, inputA = 0, inputB = 0 }) {
    return selectFirst ? inputA : inputB;
  },
};

const slider = {
  title: 'Slider',
  type: 'slider',
  outputs: ['number'],
  parameters: {
    value: {
      type: 'number',
      internal: true,
      label: false,
      defaultValue: 0,
      inputType: 'slider',
      min: 0,
      max: 1,
      step: 0.01,
      value: 0,
    },
  },
  compute({ value = 0 }) {
    return value;
  },
};

export default [boolops, compare, picker, slider];
