export default (
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
) => {
  return [ax * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
};
