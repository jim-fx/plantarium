import type { ValueTemplate } from "@plantarium/ui";
import type { NodeContext } from "@plantarium/generator"
import type { InstancedGeometry, PlantStem } from "@plantarium/types"
import { TransferGeometry } from "@plantarium/types";

export type PlantValue = {
  stems: PlantStem[]
  geometry: TransferGeometry
  instances: InstancedGeometry[]
}

type PlantTemplate = {
  type: "plant"
  value?: PlantValue
}

type ModelTemplate = {
  type: "model"
  value?: TransferGeometry
}

type Vec2Template = {
  type: "vec2"
  value: { x: number, y: number }
}

type Vec3Template = {
  type: "vec3"
  value: { x: number, y: number, z: number }
}

type AllTemplates = ValueTemplate | PlantTemplate | Vec2Template | Vec3Template | ModelTemplate;

export type NodeDataTypes = AllTemplates["type"];

type NodeParameters = Record<string, AllTemplates & { internal?: boolean, external?: boolean, label?: boolean | string, required?: boolean }>;

type ResolvableParameter<T extends NodeParameters[string], K = T["value"]> = T["internal"] extends boolean ? K : (alpha?: number) => K;

type Parameter<T extends NodeParameters[string]> =
  T extends PlantTemplate ? ResolvableParameter<T, PlantValue>
  : T extends ModelTemplate ? ResolvableParameter<T, TransferGeometry>
  : ResolvableParameter<T>;

export type Params<T extends NodeParameters = NodeParameters> = {
  [K in keyof T]: Parameter<T[K]>
};

export type PlantNode<T extends NodeParameters = {}> = {
  title: string,
  type: string,
  outputs: NodeDataTypes[],
  meta?: { description?: string, tags?: string },
  parameters: T,
  computeValue?: (p: Params<T>, ctx: NodeContext, alpha?: number) => unknown
  computeStem?: (p: Params<T>, ctx: NodeContext) => { stems: PlantStem[], instances?: InstancedGeometry[] }
  computeGeometry?: (p: Params<T>, result: ReturnType<PlantNode["computeStem"]>, ctx: NodeContext) => { geometry: TransferGeometry }
}

export function typeCheckNode<T extends NodeParameters>(node: PlantNode<T>): PlantNode {
  return node;
}
