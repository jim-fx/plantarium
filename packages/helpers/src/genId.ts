/**
 * Generates unique incemental ids
 */
export default () => {
  const idMap: { [id: number]: boolean } = {};
  let amount = 0;

  const genID = (id = 0, iteration = 0): string => {
    if (iteration > 500) {
      throw new Error('Infinite loop in id generation algo');
    }

    if (id in idMap) {
      return genID(Math.max(id++, amount++), iteration + 1);
    }

    idMap[id] = true;

    return id.toString();
  };

  genID.reset = () => {
    Object.keys(idMap).forEach((id: string) => delete idMap[+id]);
    amount = 0;
  };

  return genID;
};
