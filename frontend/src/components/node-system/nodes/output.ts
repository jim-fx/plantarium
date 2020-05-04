export default {
  name: 'Output',
  inputs: ['*', 'vec3'],
  compute: (inputData: number[][]) => {
    const [color = [0, 0, 0], dims = [1, 1, 1]] = inputData;
    return {
      color,
      dims: {
        width: dims[0],
        depth: dims[1],
        height: dims[2],
      },
    };
  },
};
