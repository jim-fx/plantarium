const regex = /^(?:[ ]+)?([a-z]*) ([^ ]*) (?:\[(.*?)\] )?\(([^()]+)\)/gm;
export default (s: string) => {
  const [rawTitle, ...rawLines] = s.split('\n');

  const [type, title] = rawTitle.split(':');

  const lines = rawLines
    .map((l) => l.trim())
    .map((l) => {
      const res = [...l.matchAll(regex)][0];
      const [, , name, alias, location] = res;
      return {
        name,
        location,
        ...(alias ? { alias: alias.replace('as ', '') } : {}),
      };
    });

  return { title, type, lines };
};
