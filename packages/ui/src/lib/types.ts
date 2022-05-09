export type CheckboxTemplate = {
  type: "boolean",
  value: boolean;
}

export type IntegerTemplate = {
  type: "number",
  inputType?: "integer",
  min?: number;
  max?: number;
  value?: number;
}

export type SelectTemplate = {
  type: "select"
  values: string[],
  value: string;
}

export type FloatTemplate = {
  type: "number",
  inputType?: "float",
  min?: number,
  max?: number,
  value?: number
}

export type CurveTemplate = {
  type: "curve",
  values: {
    x: number;
    y: number;
    pinned: boolean;
  }[]
}

export type ShapeTemplate = {
  type: "shape",
  values: {
    x: number;
    y: number;
    pinned: boolean;
  }[]
}
export type ValueTemplate = CheckboxTemplate | IntegerTemplate | SelectTemplate | FloatTemplate | CurveTemplate | ShapeTemplate;


