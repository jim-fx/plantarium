import type { TransferGeometry } from '@plantarium/types';
import { Geometry, type OGLRenderingContext } from 'ogl';

export default function (gl: OGLRenderingContext, transfer: TransferGeometry) {
  let amount = transfer.normal.length / 3;

  for (let i = 0; i < amount; i++) {
    transfer.normal[i * 3 + 0] = transfer.normal[i * 3 + 0];
    transfer.normal[i * 3 + 1] = transfer.normal[i * 3 + 1];
    transfer.normal[i * 3 + 2] = transfer.normal[i * 3 + 2];
  }

  return new Geometry(gl, {
    position: { size: 3, data: transfer.position },
    normal: { size: 3, data: transfer.normal },
    uv: { size: 2, data: transfer.uv },
    index: { data: transfer.index }
  });
}
