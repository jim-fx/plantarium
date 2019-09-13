import arrow from "./arrow.svg";
import branch from "./branch.svg";
import cog from "./cog.svg";
import cross from "./cross.svg";
import leaf from "./leaf.svg";
import stem from "./stem.svg";
import triangle from "./triangle.svg";

interface icon {
  arrow: SVGElement;
  brach: SVGElement;
  cog: SVGElement;
  cross: SVGElement;
  leaf: SVGElement;
  stem: SVGElement;
  triangle: SVGElement;
}

const objs = {};
const exp: icon = <icon>{};
const strings = {
  arrow: arrow,
  branch: branch,
  cog: cog,
  cross: cross,
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
