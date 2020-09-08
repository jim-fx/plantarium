import { curve } from '@plantarium/helpers';
export default function (points: Point[]): number[] {
  return curve.toArray(points).map((p) => p.y);
}
