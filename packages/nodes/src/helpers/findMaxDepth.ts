import { PlantValue } from "../types";

export function findMaxDepth({ stems = [], instances = [] }: PlantValue) {
  return Math.max(...stems.map(s => s.depth), ...instances.map(i => i.depth), 0);
}
