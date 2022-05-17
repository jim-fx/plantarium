import type { CheckboxTemplate, FloatTemplate, IntegerTemplate, SelectTemplate, ValueTemplate as _ValueTemplate } from "@plantarium/ui";

export type ValueTemplate = (_ValueTemplate | { type: "*", value?: unknown }) & { internal?: boolean, external?: boolean, required?: boolean, label?: boolean | string };


type NodeParameters = Record<string, ValueTemplate>;
export type Params<T extends NodeParameters> = {
  [K in keyof T]
  : T[K] extends FloatTemplate ? number
  : T[K] extends IntegerTemplate ? number
  : T[K] extends CheckboxTemplate ? boolean
  : T[K] extends SelectTemplate ? string
  : unknown;
};

export type NodeTypeData<T extends NodeParameters = NodeParameters> = {
  title: string,
  type: string,
  outputs: string[],
  meta?: { description?: string, tags?: string[] },
  parameters: T,
  compute: (p: Params<T>) => void
}

export function checkNodeType<T extends NodeParameters>(node: NodeTypeData<T>) {
  return node;
}

export * from "./interfaces"
