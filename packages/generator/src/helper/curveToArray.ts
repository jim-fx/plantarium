import { Curve } from '@plantarium/helpers';
import { Point } from '@plantarium/types';
const samplingCurve = new Curve();
export default function (points: Point[]): number[] {
  samplingCurve.points = points;
  return samplingCurve.array;
}
