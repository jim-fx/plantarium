import { TransferGeometry } from "@plantarium/types";

export default function(geometry: TransferGeometry, logAnyway = false) {

  const nn = geometry.normal.includes(NaN);
  if (nn) console.warn("Normals has NaN");

  const _in = geometry.index.includes(NaN);
  if (_in) console.warn("Index has NaN");

  const pn = geometry.position.includes(NaN);
  if (pn) console.warn("Position has NaN");

  const un = geometry.uv.includes(NaN);
  if (un) console.warn("UV has NaN");

  const positionAmount = geometry.position.length / 3;

  if (geometry.position.length !== geometry.normal.length) {
    console.warn("position and normal amount not eqal")
  }

  if (geometry.uv.length !== positionAmount * 2) {
    console.groupCollapsed("uv amount not correct, should be " + positionAmount * 2 + " is " + geometry.uv.length);
    console.trace()
    console.groupEnd()
  }

  if (nn || _in || pn || un || logAnyway) {

    console.log("Check", {
      p: geometry.position.length,
      pn,
      n: geometry.normal.length,
      nn,
      i: geometry.index.length,
      in: _in,
      u: geometry.uv.length,
      un,
    })
  }

}
