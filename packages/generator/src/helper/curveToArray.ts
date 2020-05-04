import { Curve } from '.@plantarium/helpers';
const samplingCurve = new Curve();
export default function (points: Point[]): number[] {
  samplingCurve.points = points;
  return samplingCurve.array;
}
