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

export type RangeTemplate = {
  type: "vec2"
  inputType: "range";
  value?: { x: number, y: number };
}


export type FloatTemplate = {
  type: "number",
  inputType?: "float",
  min?: number,
  max?: number,
  value?: number,
  step?: number,
}

export type Vec3Template = {
  type: "vec3",
  inputType?: "float",
  value?: { x: number, y: number, z: number },
}


export type Vec2Template = {
  type: "vec2",
  inputType?: "float",
  value?: { x: number, y: number, z: number },
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

export type ValueTemplate = RangeTemplate | CheckboxTemplate | IntegerTemplate | SelectTemplate | TabTemplate | FloatTemplate | CurveTemplate | ShapeTemplate | Vec3Template | Vec2Template;



