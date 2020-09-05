export default (ax, ay, az, bx, by, bz) => {
  return [ax * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
};
