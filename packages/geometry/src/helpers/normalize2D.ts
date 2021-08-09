import length2D from './length2D';

export default ([x, y]: number[]) => {
  const l = length2D(x, y);

  if (l === 0) {
    return [1, 0];
  }

  return [x / l, y / l];
};
