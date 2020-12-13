import { curve } from '@plantarium/helpers';
export default function (points: Vec2[]): number[] {
  return curve.toArray(points).map((p) => p.y);
}
