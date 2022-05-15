import type { Vec3 } from 'ogl-typescript';
export default function (origin?: Vec3 | [number, number, number], radius?: number, resolution?: number): {
    position: Float32Array;
    normal: Float32Array;
    uv: Float32Array;
    index: Uint16Array;
};
