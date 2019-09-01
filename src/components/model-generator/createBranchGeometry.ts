import curveToArray from "./helper/curveToArray";
import { tube, join } from "./geometry";
import noise from "./helper/noise";

let geometry: TransferGeometry;
let oldDescription: string;

function getBranchDiameter(diameter: parameter, stemDiameter: number, i: number) {
  let v = 0.1;

  if ("variation" in diameter) {
    v = diameter.value - diameter.value * diameter.variation * ((noise.n1d(93815 + i * 200) + 1) / 2);
  } else {
    v = diameter.value;
  }

  if (diameter.curve && diameter.curve.length) {
    return curveToArray(diameter.curve).map((_v: number) => v * _v * stemDiameter);
  } else {
    return [0, 1 * v * stemDiameter];
  }
}

export default function(pd: plantDescription, settings: settings, skeletons: Float32Array[], i: number): TransferGeometry {
  //Check if we need to regenerate
  const newDescription = JSON.stringify(pd);
  if (!settings.forceUpdate && oldDescription === newDescription && geometry) {
    return geometry;
  }

  const diameter = getBranchDiameter(pd.branches.diameter, pd.stem.diameter.value, i);
  const amount = skeletons.length;
  const resX = settings.stemResX || 3;

  return join(
    ...skeletons.map((skeleton, i) => {
      return tube(skeleton, diameter.map(v => v * (1 - i / amount)), resX);
    })
  );
}
