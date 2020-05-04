import arrow from './arrow.svg';
import branch from './branch.svg';
import checkmark from './checkmark.svg';
import cog from './cog.svg';
import cross from './cross.svg';
import io from './io.svg';
import leaf from './leaf.svg';
import stem from './stem.svg';
import triangle from './triangle.svg';

interface Icon {
  arrow: SVGElement;
  brach: SVGElement;
  checkmark: SVGElement;
  cog: SVGElement;
  cross: SVGElement;
  io: SVGElement;
  leaf: SVGElement;
  stem: SVGElement;
  triangle: SVGElement;
}

const objs: { [key: string]: any } = {};
const exp: { [key: string]: any } = {} as Icon;
const strings = {
  arrow,
  branch,
  checkmark,
  cog,
  cross,
  io,
  leaf,
  stem,
  triangle,
};
const d = document.createElement('div');
Object.keys(strings).forEach((key) => {
  exp[key] = {};
  Object.defineProperty(exp, key, {
    get: () => {
      if (objs[key]) {
        return objs[key].cloneNode(true);
      } else {
        // @ts-ignore
        d.innerHTML = strings[key];
        objs[key] = d.children[0];
        return objs[key];
      }
    },
  });
});

export default exp;
