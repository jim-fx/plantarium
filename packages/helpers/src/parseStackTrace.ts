const regex =
  /^(?:[ ]+)?(?:at )([^ ]*)?(?: )?(?:\[(.*?)\] )?(?:\(([^()]+)\))?$/gm;

const stripPath = (s) =>
  s
    .replace(window.location.href, '')
    .replace(/^node_modules/, '')
    .replace(/.+?(?=plantarium)plantarium\//, '');

export default (s: string) => {
  const [rawTitle, ...rawLines] = s.split('\n');

  const [type, title] = rawTitle.split(':');

  const lines = rawLines.map((l) => {
    const res = [...l.matchAll(regex)][0];
    const [, name, alias, location] = res;
    return {
      name: stripPath(name),
      ...(location ? { location: stripPath(location) } : {}),
      ...(alias ? { alias: alias.trim().replace('as ', '') } : {}),
    };
  });

  console.log(lines);

  return { title, type, lines };
};
