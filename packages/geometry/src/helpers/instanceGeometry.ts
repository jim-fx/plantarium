import { InstancedGeometry, TransferGeometry } from "@plantarium/types";
import insertArray from "./insertArray";

export default function instanceGeometry(geo: TransferGeometry, { offset, scale, rotation, id, baseAlpha, depth }: { id?: string, depth?: number, baseAlpha?: Float32Array, offset?: number[] | Float32Array, scale?: number[] | Float32Array, rotation?: number[] | Float32Array }): InstancedGeometry {

  const maxLength = Math.max(...[offset?.length, scale?.length, rotation?.length].filter(v => !!v));

  const _offset = new Float32Array(maxLength)
  const _scale = new Float32Array(maxLength).fill(1)
  const _rotation = new Float32Array(maxLength)


  if (offset?.length) {
    insertArray(_offset, 0, offset as number[])
  }

  if (scale?.length) {
    insertArray(_scale, 0, scale as number[])
  }

  if (rotation?.length) {
    insertArray(_rotation, 0, rotation as number[])
  }

  return {
    ...geo,
    id,
    baseAlpha,
    depth,
    offset: _offset,
    scale: _scale,
    rotation: _rotation
  }


}
