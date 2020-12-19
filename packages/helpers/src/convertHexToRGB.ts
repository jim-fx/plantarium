export default (input: string): [number, number, number] => {
  const aRgbHex = input.match(/.{1,2}/g);
  return [
    parseInt(aRgbHex[0], 16) / 255,
    parseInt(aRgbHex[1], 16) / 255,
    parseInt(aRgbHex[2], 16) / 255,
  ];
};
