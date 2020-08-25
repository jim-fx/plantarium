import { curve } from '@plantarium/helpers';
import { Point } from '@plantarium/types';
export default function (points: Point[]): number[] {
  return curve.toArray(points).map((p) => p.y);
}
