export default (input: string): [number, number, number] => {
  if (input[0] === '#') input = input.replace('#', '');

  if (input.length === 3)
    input = input[0] + input[0] + input[1] + input[1] + input[2] + input[2];

  const aRgbHex = input.match(/.{1,2}/g);
  return [
    parseInt(aRgbHex[0], 16) / 255,
    parseInt(aRgbHex[1], 16) / 255,
    parseInt(aRgbHex[2], 16) / 255,
  ];
};
