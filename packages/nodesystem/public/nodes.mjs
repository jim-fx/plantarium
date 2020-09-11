//Boolean Operations
const boolops = {
  title: 'boolops',
  outputs: ['boolean'],
  state: {
    a: {
      type: "boolean",
    },
    b: {
      type: "boolean",
    },
    mode: {
      values: ['and', 'or'],
    }
  },
  compute: function ([input1 = false, input2 = false], { mode = 'and' }) {
    if (mode === 'and') return input1 && input2;
    if (mode === 'or') return input1 || input2;
    return false;
  },
};

//Compare numbers
const compare = {
  title: 'compare',
  outputs: ['boolean'],
  state: {
    a: {
      type: "number"
    },
    b: {
      type: "number"
    },
    mode: {
      values: ['>', '<', '='],
    }
  },
  compute: function ([first = 0, second = 0], { mode = '=' }) {
    switch (mode) {
      case '=':
        return first === second;
      case '>':
        return first > second;
      case '<':
        return first < second;
    }
    return false;
  },
};

//Picker
const picker = {
  title: 'picker',
  outputs: ['number'],
  parameters: {
    a: {
      type: "number",
    },
    b: {
      type: "number",
    },
    selectFirst: {
      type: "boolean"
    },
  },
  compute({ selectFirst = true, input1 = 0, input2 = 0 }) {
    return selectFirst ? input1 : input2;
  },
};

export default [boolops, compare, picker];
