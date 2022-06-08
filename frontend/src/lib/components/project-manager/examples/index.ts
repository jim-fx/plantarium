import tree from "./tree.json"
import daisy from "./daisy.json"
import fern from "./fern.json"
import fernSimple from "./fern-simple.json"
import type { PlantProject } from "@plantarium/types"

export { fernSimple }

export default [
  fern,
  tree,
  daisy,
  fernSimple,
] as unknown as PlantProject[]
