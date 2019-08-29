import { Vec3 } from "ogl";
import interpolateArray from "./helper/interpolateArray";
import Curve from "../../helpers/curve";
import { circle, join } from "./geometry";

const samplingCurve = new Curve();

let geometry: TransferGeometry;
let oldDescription: string;

//Circle(p(pd.stem.diameter), settings["stemResX"], pd.stem.height.variation);

export default function(stem: stemDescription, settings: settings, skeleton: Vec3[]): TransferGeometry {
  //Check if we need to regenerate
  const newDescription = JSON.stringify(stem);
  if (!settings.forceUpdate && oldDescription === newDescription && geometry) {
    return geometry;
  }

  const amount = skeleton.length;
  const res = settings.stemResX;
  const diameter = stem.diameter.value || 1;

  let diameterArray: number[] = [0, 1];
  if (stem.diameter.curve && stem.diameter.curve.length) {
    samplingCurve.points = stem.diameter.curve;
    diameterArray = samplingCurve.array;
  }

  const circles: TransferGeometry[] = skeleton.map((origin, i) => {
    return circle(origin, interpolateArray(diameterArray, 1 - i / amount) * diameter, res, 0, 0);
  });

  return join(...circles);
}
