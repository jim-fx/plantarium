import { Geometry } from 'ogl';

export default function (
  gl: WebGL2RenderingContext,
  transfer: TransferGeometry,
) {
  return new Geometry(gl, {
    position: { size: 3, data: transfer.position },
    normal: { size: 3, data: transfer.normal },
    uv: { size: 2, data: transfer.uv },
    index: { data: transfer.index },
  });
}
