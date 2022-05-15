import { Vec3 } from 'ogl-typescript';
export default function (origin?: Vec3, size?: number): {
    position: Float32Array;
    normal: Float32Array;
    uv: Float32Array;
    index: Uint16Array;
};
