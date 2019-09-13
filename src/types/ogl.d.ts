declare module "ogl" {
  export class Euler extends Array {
    constructor(x?: number, y?: number, z?: number, order?: string);

    x: number;
    y: number;
    z: number;

    set: (x: number, y?: number, z?: number) => this;

    copy: (v: Vec3) => this;

    reorder: (order: string) => this;

    fromRotationMatrix: (m: Mat3, order?: string) => this;

    fromQuaternion: (q: Quat, order?: string) => this;
  }

  export class Color extends Array {
    constructor(r?: number | string, g?: number, b?: number);

    static hexToRGB: (hex: string) => number[];
  }

  export class Vec2 extends Array {
    constructor(x?: number, y?: number);

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

  export class Vec3 extends Array {
    constructor(x?: number, y?: number, z?: number);

    x: number;
    y: number;
    z: number;

    set: (x: number, y?: number, z?: number) => this;

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

  export class Mat3 extends Array {
    constructor(
      m00: number,
      m01: number,
      m02: number,
      m10: number,
      m11: number,
      m12: number,
      m20: number,
      m21: number,
      m22: number
    );

    set: (
      m00: number,
      m01: number,
      m02: number,
      m10: number,
      m11: number,
      m12: number,
      m20: number,
      m21: number,
      m22: number
    ) => Mat3;

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

  export class Mat4 extends Array {
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

  export class Quat extends Array {
    constructor(x?: number, y?: number, z?: number, w?: number);

    x: number;
    y: number;
    z: number;
    w: number;

    identity: () => this;
    set: (x: number, y: number, z: number, w: number) => this;

    rotateX: (a: number) => this;
    rotateY: (a: number) => this;
    rotateZ: (a: number) => this;

    inverse: (q?: Quat) => this;

    conjugate: (q?: Quat) => this;
    copy: (q: Quat) => this;

    normalize: (q?: Quat) => this;

    multiply: (qA: Quat, qB: Quat) => this;

    dot: (v: Vec3) => number;

    fromMatrix3: (matrix3: Mat3) => this;

    fromEuler: (euler: number) => this;

    fromAxisAngle: (axis: Vec3, a: number) => this;

    fromArray: (a: number[], offset?: number) => this;
    toArray: (a?: [], offset?: number) => number[];
  }

  export class Camera extends Transform {
    constructor(
      gl: WebGL2RenderingContext,
      object: { near?: number; far?: number; fov?: number; aspect?: number }
    );

    perspective: (object: {
      near?: number;
      far?: number;
      fov?: number;
      aspect?: number;
    }) => Camera;
    orthographic: (object: {
      near?: number;
      far?: number;
      fov?: number;
      aspect?: number;
    }) => Camera;

    updateMatrixWorld: () => Camera;

    lookAt: (target: Vec3) => Camera;

    project: (v: Vec3) => Camera;
    unproject: (v: Vec3) => Camera;

    updateFrustum: () => void;

    frustumIntersectsMesh: () => void;

    frustumIntersectsSphere: () => void;
  }

  export class Transform {
    position: Vec3;
    quaternion: Quat;
    scale: Vec3;
    rotation: Euler;
    up: Vec3;

    setParent: (parent: Transform, notifyParent?: boolean) => void;
    addChild: (parent: Transform, notifyChild?: boolean) => void;
    removeChild: (parent: Transform, notifyChild?: boolean) => void;

    updateMatrixWorld: (force?: boolean) => void;
    updateMatrix: () => void;
    traverse: (callback: Function) => void;
    decompose: () => void;
    lookAt: (target: Vec3) => void;
  }

  export class Program {
    constructor(
      gl: WebGL2RenderingContext,
      config?: {
        vertex: String;
        fragment: String;
        uniforms?: object;
        cullFace?: number;
      }
    );

    uniforms: any;

    setBlendFunc: () => void;
    setBlendEquation: () => void;
    applyState: () => void;
  }

  export class Renderer {
    constructor(object?: {
      canvas?: HTMLCanvasElement;
      width?: number;
      height?: number;
      dpr?: number;
      alpha?: boolean;
      depth?: boolean;
      stencil?: boolean;
      antialias?: boolean;
      premultipliedAlpha?: boolean;
      preserveDrawingBuffer?: boolean;
      powerPreference?: string;
      autoClear?: boolean;
      webgl?: number;
    });

    gl: WebGL2RenderingContext;

    setSize: (width: number, height: number) => void;
    setViewport: (width: number, height: number) => void;

    render: (object: {
      scene?: Transform;
      camera?: Camera;
      update?: boolean;
      sort?: boolean;
      frustumCull?: boolean;
    }) => void;
  }

  export class Texture {
    constructor(
      gl: WebGL2RenderingContext,
      object: {
        image?: HTMLImageElement;
        generateMipmaps?: boolean;
        premultiplyAlpha?: boolean;
        unpackAlignment?: number;
        wrapS?: number;
        wrapT?: number;
        flip?: boolean;
        level?: number;
        width?: number; // used for RenderTargets or Data Textures
        height?: number;
      }
    );

    image: HTMLImageElement;
  }
  export class Geometry {
    constructor(gl: WebGL2RenderingContext, object: any);

    gl: WebGL2RenderingContext;

    bounds: {
      min: Vec3;
      max: Vec3;
      center: Vec3;
      scale: Vec3;
      radius: number;
    };

    attributes: any;

    setInstancedCount: (value: number) => void;

    setIndex: (value: Uint16Array | Uint32Array) => void;

    addAttribute: (key: string, attribute: any) => void;

    updateAttribute: (attr: any) => void;

    computeBoundingBox: (array?: number[]) => void;

    setDrawRange: (start: number, count: number) => void;

    remove: () => void;
  }

  export class Mesh extends Transform {
    constructor(
      gl: WebGL2RenderingContext,
      object: {
        mode?: number;
        geometry: Geometry;
        program: Program;
      }
    );

    program: Program;

    mode: number;

    geometry: Geometry;

    draw: (camera: Camera) => void;
  }

  export class Sphere extends Geometry {
    constructor(
      gl: WebGL2RenderingContext,
      object: {
        radius?: number;
        widthSegments?: number;
        heightSegments?: number;
        phiStart?: number;
        phiLength?: number;
        thetaStart?: number;
        thetaLength?: number;
        attributes?: {};
      }
    );
  }

  export class Orbit {
    constructor(
      object: Camera,
      config: {
        element?: HTMLElement;
        enabled?: boolean;
        target?: Vec3;
        ease?: number;
        inertia?: number;
        enableRotate?: boolean;
        rotateSpeed?: number;
        enableZoom?: boolean;
        zoomSpeed?: number;
        enablePan?: boolean;
        panSpeed?: number;
        minPolarAngle?: number;
        maxPolarAngle?: number;
        minAzimuthAngle?: number;
        maxAzimuthAngle?: number;
        minDistance?: number;
        maxDistance?: number;
      }
    );

    target: Vec3;

    update: () => void;
  }
}
