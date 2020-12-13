import length2D from './length2D';

export default (x: number, y: number) => {
  const l = length2D(x, y);
  return [x / l, y / l];
};
