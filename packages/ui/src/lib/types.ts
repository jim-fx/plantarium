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
  step?: number,
}

export type SelectTemplate = {
  type: "select"
  inputType?: "dropdown";
  values: string[],
  value: string;
}

export type TabTemplate = {
  type: "select"
  inputType?: "tab";
  values: string[],
  value: string;
}


export type FloatTemplate = {
  type: "number",
  inputType?: "float",
  min?: number,
  max?: number,
  value?: number,
  step?: number,
}

export type CurveTemplate = {
  type: "curve",
  value: {
    x: number;
    y: number;
    pinned: boolean;
  }[]
}

export type ShapeTemplate = {
  type: "shape",
  value: {
    x: number;
    y: number;
    pinned: boolean;
  }[]
}

export type ValueTemplate = CheckboxTemplate | IntegerTemplate | SelectTemplate | TabTemplate | FloatTemplate | CurveTemplate | ShapeTemplate;



