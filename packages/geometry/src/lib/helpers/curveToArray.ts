import { curve } from '@plantarium/helpers';
import type { Vec2 } from '@plantarium/types';
export default function(points: Vec2[]): number[] {
  return curve.toArray(points).map((p) => p.y);
}
