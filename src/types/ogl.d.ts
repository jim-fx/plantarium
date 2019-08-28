declare module "ogl" {
  export class Vec2 {
    constructor(x: number, y: number);

    x: number;
    y: number;

    set: (x: number, y?: number) => Vec2;
    copy: () => Vec2;
    add: (va: Vec2, vb: Vec2) => Vec2;
    sub: (va: Vec2, vb: Vec2) => Vec2;
    multiply: (v: number) => Vec2;
    divide: (v: number) => Vec2;
    len: () => number;
    distance: (v: Vec2) => number;
    squaredLen: () => number;
    squaredDistance: (v: Vec2) => number;
    negate: (v?: Vec2) => Vec2;
    cross: (va: Vec2, vb: Vec2) => Vec2;
    scale: (v: Vec2) => Vec2;
    normalize: () => Vec2;
    dot: (v: Vec2) => number;
    equals: (v: Vec2) => boolean;
    applyMatrix3: (mat3: Mat3) => Vec2;
    applyMatrix4: (mat4: Mat4) => Vec2;
    applyQuaternion: (q: Quat) => Vec2;
    angle: (v: Vec2) => number;
    lerp: (v: Vec2, t: number) => Vec2;
    clone: () => Vec2;
    fromArray: (array: number[], offset?: number) => Vec2;
    toArray: (array?: Array<any>, offset?: number) => Vec2;
    transformDirection: (mat4: Mat4) => Vec2;
  }

  export class Vec3 {
    constructor(x?: number, y?: number, z?: number);

    x: number;
    y: number;
    z: number;

    copy: () => Vec3;
    add: (va: Vec3, vb?: Vec3) => Vec3;
    sub: (va: Vec3, vb?: Vec3) => Vec3;
    multiply: (v: number) => Vec3;
    divide: (v: number) => Vec3;
    len: () => number;
    distance: (v: Vec3) => number;
    squaredLen: () => number;
    squaredDistance: (v: Vec3) => number;
    negate: (v?: Vec3) => Vec3;
    cross: (va: Vec3, vb: Vec3) => Vec3;
    scale: (v: Vec3) => Vec3;
    normalize: () => Vec3;
    dot: (v: Vec3) => number;
    equals: (v: Vec3) => boolean;
    applyMatrix4: (mat4: Mat4) => Vec3;
    applyQuaternion: (q: Quat) => Vec3;
    angle: (v: Vec3) => number;
    lerp: (v: Vec3, t: number) => Vec3;
    clone: () => Vec3;
    fromArray: (array: number[], offset?: number) => Vec3;
    toArray: (array?: Array<any>, offset?: number) => number[];
    transformDirection: (mat4: Mat4) => Vec3;
  }

  export class Mat3 {
    constructor(m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number);

    set: (m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number) => Mat3;

    translate: (v: Vec3, m?: Mat3) => Mat3;

    rotate: (v: Vec3, m?: Mat3) => Mat3;

    scale: (v: Vec3, m?: Mat3) => Mat3;

    multiply: (ma: Mat3, mb: Mat3) => Mat3;

    identity: () => Mat3;

    copy: (m: Mat3) => Mat3;

    fromMatrix4: (m: Mat4) => Mat3;

    fromQuaternion: (q: Quat) => Mat3;

    fromBasis: (vec3a: Vec3, vec3b: Vec3, vec3c: Vec3) => Mat3;

    inverse: (m?: Mat3) => Mat3;

    getNormalMatrix: (m: Mat3) => Mat3;
  }

  export class Mat4 {
    constructor(
      m00: number,
      m01: number,
      m02: number,
      m03: number,
      m10: number,
      m11: number,
      m12: number,
      m13: number,
      m20: number,
      m21: number,
      m22: number,
      m23: number,
      m30: number,
      m31: number,
      m32: number,
      m33: number
    );

    x: number;
    y: number;
    z: number;
    w: number;

    set: (
      m00: number,
      m01: number,
      m02: number,
      m03: number,
      m10: number,
      m11: number,
      m12: number,
      m13: number,
      m20: number,
      m21: number,
      m22: number,
      m23: number,
      m30: number,
      m31: number,
      m32: number,
      m33: number
    ) => Mat4;
  }

  export class Geometry {
    constructor(gl: WebGL2RenderingContext, attributes: any);

    gl: WebGL2RenderingContext;

    addAttribute: (key: string, attribute: any) => void;

    setDrawRange: (start: number, count: number) => void;

    remove: () => void;
  }
}

interface transferGeometry {
  uv: Float32Array;
  position: Float32Array;
  index: Uint16Array;
  normal: Float32Array;
}
