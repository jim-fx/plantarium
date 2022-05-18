import { InstancedGeometry, TransferGeometry } from "@plantarium/types";

export default function instanceGeometry(geo: TransferGeometry, { offset, scale, rotation }: { offset?: number[] | Float32Array, scale?: number[] | Float32Array, rotation?: number[] | Float32Array }): InstancedGeometry {

  const maxLength = Math.max(...[offset?.length, scale?.length, rotation?.length].filter(v => !!v));

  const _offset = new Array(maxLength).fill(null).map(_ => 0)
  const _scale = new Array(maxLength).fill(null).map(_ => 1)
  const _rotation = new Array(maxLength).fill(null).map(_ => 0)


  if (offset?.length) {
    _offset.splice(0, offset.length, ...offset);
  }


  if (scale?.length) {
    _scale.splice(0, scale.length, ...scale);
  }


  if (rotation?.length) {
    _rotation.splice(0, rotation.length, ...rotation);
  }

  return {
    ...geo,
    offset: Float32Array.from(_offset),
    scale: Float32Array.from(_scale),
    rotation: Float32Array.from(_rotation)
  }


}
