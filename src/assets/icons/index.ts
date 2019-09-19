import arrow from "./arrow.svg";
import branch from "./branch.svg";
import checkmark from "./checkmark.svg";
import cog from "./cog.svg";
import cross from "./cross.svg";
import io from "./io.svg";
import leaf from "./leaf.svg";
import stem from "./stem.svg";
import triangle from "./triangle.svg";

interface icon {
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

const objs = {};
const exp: icon = <icon>{};
const strings = {
  arrow: arrow,
  branch: branch,
  checkmark: checkmark,
  cog: cog,
  cross: cross,
  io: io,
  leaf: leaf,
  stem: stem,
  triangle: triangle
};
const d = document.createElement("div");
Object.keys(strings).forEach(key => {
  exp[key] = {};
  Object.defineProperty(exp, key, {
    get: function() {
      if (objs[key]) {
        return objs[key].cloneNode(true);
      } else {
        d.innerHTML = strings[key];
        objs[key] = d.children[0];
        return objs[key];
      }
    }
  });
});

export default exp;
