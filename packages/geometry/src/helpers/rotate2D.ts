export default (x: number, y: number, degrees: number) => {
  return [
    x * Math.cos(degrees) - y * Math.sin(degrees),
    x * Math.sin(degrees) + y * Math.cos(degrees),
  ];
};
