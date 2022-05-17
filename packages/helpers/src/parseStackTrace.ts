import { parse } from "stacktrace-parser";

const stripPath = (s) =>
  s
    .replace(window.location.href, '')
    .replace(/^node_modules/, '')
    .replace(/.+?(?=plantarium)plantarium\//, '');

export default (e: Error) => {
  const lines = parse(e.stack).map(s => {
    s.file = stripPath(s.file);
    return s;
  })
  return { title: e.message, type: e.name, lines };
};
