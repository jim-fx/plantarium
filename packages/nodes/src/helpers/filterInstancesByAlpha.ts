import { insertArray } from "@plantarium/geometry";
import { InstancedGeometry } from "@plantarium/types";

export function filterInstancesByAlpha(instances: InstancedGeometry[], min = 0, max = 1, depth = -1) {

  return instances.filter(inst => {

    if (depth !== -1 && inst.depth !== depth) return true;

    let amount = inst.baseAlpha.filter(a => a >= min && a <= max).length;
    if (!amount) return false;
    if (amount === inst.baseAlpha.length) return true;

    const scale = new Float32Array(amount * 3);
    const offset = new Float32Array(amount * 3);
    const rotation = new Float32Array(amount * 3);
    const baseAlpha = new Float32Array(amount)

    let j = 0;
    for (let i = 0; i < inst.baseAlpha.length; i++) {
      if (inst.baseAlpha[i] >= min && inst.baseAlpha[i] <= max) {
        insertArray(scale, j * 3, inst.scale.slice(i * 3, i * 3 + 3));
        insertArray(offset, j * 3, inst.offset.slice(i * 3, i * 3 + 3));
        insertArray(rotation, j * 3, inst.rotation.slice(i * 3, i * 3 + 3));
        baseAlpha[j] = inst.baseAlpha[i]
        j++;
      }
    }

    inst.baseAlpha = baseAlpha;
    inst.offset = offset;
    inst.rotation = rotation;
    inst.scale = scale;

    return true;


  });

}
