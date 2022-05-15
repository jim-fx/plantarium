import type { TransferGeometry } from '@plantarium/types';
import { Geometry, OGLRenderingContext } from 'ogl-typescript';

export default function(
  gl: OGLRenderingContext,
  transfer: TransferGeometry,
) {
  return new Geometry(gl, {
    position: { size: 3, data: transfer.position },
    normal: { size: 3, data: transfer.normal },
    uv: { size: 2, data: transfer.uv },
    index: { data: transfer.index },
  });
}
