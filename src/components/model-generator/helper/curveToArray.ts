import Curve from "../../../helpers/curve";
const samplingCurve = new Curve();
export default function(points: point[]): number[] {
  samplingCurve.points = points;
  return samplingCurve.array;
}
