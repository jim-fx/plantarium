export default {
  name: 'Output',
  state: {
    main: {
      type: 'pd',
      label: 'plant',
      internal: false,
    },
  },
  compute: (input) => {
    return input.main;
  },
};
