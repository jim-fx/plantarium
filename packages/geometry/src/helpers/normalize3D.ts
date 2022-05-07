import length3D from './length3D';
export default ([x, y, z]: number[]): [number, number, number] => {
  const l = length3D(x, y, z);
  return [x / l, y / l, z / l];
};
