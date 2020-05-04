import curveToArray from './helper/curveToArray';
import { join } from './geometry';
import tube from './geometry/_tube';
import noise from './helper/noise';

let geometry: TransferGeometry;
let oldDescription: string;

function getBranchDiameter(
  diameter: Parameter,
  stemDiameter: Parameter,
  i: number,
) {
  let v = 0.1;

  if ('variation' in stemDiameter) {
    v =
      diameter.value -
      diameter.value *
        stemDiameter.variation *
        ((noise.n1d(93815 + i * 200) + 1) / 2);
  } else {
    v = diameter.value;
  }

  if (diameter.curve && diameter.curve.length) {
    return curveToArray(diameter.curve).map(
      (_v: number) => v * _v * stemDiameter.value,
    );
  } else {
    return [0.0001, v * stemDiameter.value];
  }
}

export default function (
  pd: PlantDescription,
  settings: settings,
  skeletons: Float32Array[],
  i: number,
): TransferGeometry {
  //Check if we need to regenerate
  /*const newDescription = JSON.stringify(pd);
  if (!settings.forceUpdate && oldDescription === newDescription && geometry) {
    return geometry;
  }*/

  const diameter = getBranchDiameter(pd.branches.diameter, pd.stem.diameter, i);
  const amount = skeletons.length;
  const resX = settings.stemResX || 3;

  const lowestBranch = pd.branches.lowestBranch.value || 0;

  return join(
    ...skeletons.map((skeleton, i) => {
      return tube(
        skeleton,
        diameter.map((v) => v * ((1 - i / amount) * (1 - lowestBranch))),
        resX,
      );
    }),
  );
}
