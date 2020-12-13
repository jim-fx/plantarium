import length3D from './length3D';
export default (x: number, y: number, z: number) => {
  const l = length3D(x, y, z);
  return [x / l, y / l, z / l];
};
