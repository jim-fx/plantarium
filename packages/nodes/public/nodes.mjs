//Boolean Operations
const boolops = {
  name: 'boolops',
  inputs: [['boolean'], ['boolean']],
  outputs: ['boolean'],
  state: {
    id: 'mode',
    values: ['and', 'or'],
  },
  compute: function ([input1 = false, input2 = false], { mode = 'and' }) {
    if (mode === 'and') return input1 && input2;
    if (mode === 'or') return input1 || input2;
    return false;
  },
};

//Compare numbers
const compare = {
  name: 'compare',
  inputs: [['number'], ['number']],
  outputs: ['boolean'],
  state: {
    id: 'mode',
    value: ['>', '<', '='],
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
  name: 'picker',
  inputs: [['boolean'], ['number'], ['number']],
  outputs: ['number'],
  compute: function ([selectFirst = true, input1 = 0, input2 = 0]) {
    return selectFirst ? input1 : input2;
  },
};

export default [boolops, compare, picker];
