export default ([x, y]: [number, number] | number[], degrees: number) => {
  if (degrees === 0) return [x, y]
  return [
    x * Math.cos(-degrees) - y * Math.sin(-degrees),
    x * Math.sin(-degrees) + y * Math.cos(-degrees),
  ];
};
