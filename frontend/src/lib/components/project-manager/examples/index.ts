import tree from "./tree.json"
import fern from "./fern.json"
import fernSimple from "./fern-simple.json"
import type { PlantProject } from "@plantarium/types"

export { fernSimple }

export default [
  fern,
  tree,
  fernSimple,
] as unknown as PlantProject[]
