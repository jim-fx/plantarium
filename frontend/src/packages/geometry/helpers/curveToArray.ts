import { curve } from 'packages/helpers';
export default function (points: Vec2[]): number[] {
  return curve.toArray(points).map((p) => p.y);
}
