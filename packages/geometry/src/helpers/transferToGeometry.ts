import { Geometry, OGLRenderingContext } from 'ogl-typescript';
import { TransferGeometry } from '@plantarium/types';

export default function (gl: OGLRenderingContext, transfer: TransferGeometry) {
  return new Geometry(gl, {
    position: { size: 3, data: new Float32Array(transfer.position) },
    normal: { size: 3, data: new Float32Array(transfer.normal) },
    uv: { size: 2, data: new Float32Array(transfer.uv) },
    index: { size: 1, data: new Uint32Array(transfer.index) },
  });
}
