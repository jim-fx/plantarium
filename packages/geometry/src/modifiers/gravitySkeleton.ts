import { add3D, length3D, lerp3D, multiply3D, subtract3D } from "../helpers";
import { distance3D } from "../helpers/distance";

export function gravitySkeleton(skeleton: Float32Array, strength: number, useThiccness: boolean) {

  let offsetVec = [0, 0, 0];
  const amountPoints = skeleton.length / 4;

  const outArray = skeleton.slice(0, skeleton.length)

  for (let i = 1; i < amountPoints; i++) {

    let startIndex = (i - 1) * 4;
    let endIndex = startIndex + 4;

    let startPoint = skeleton.slice(startIndex, endIndex)
    let endPoint = skeleton.slice(endIndex, endIndex + 4) as unknown as number[]
    const length = distance3D(startPoint, endPoint);

    const normalizedEndpoint = subtract3D(endPoint, startPoint);

    const downPoint = [0, -length * strength, 0];


    const _alpha = Math.sin(((i - 1) / (amountPoints - 1)) * Math.PI / 2);

    let midPoint = lerp3D(normalizedEndpoint, downPoint, strength * (i / amountPoints));

    if (midPoint[0] === 0 && midPoint[2] === 0) {
      midPoint[0] += 0.0001;
      midPoint[2] += 0.0001;
    }

    // Correct size of midpoint vec
    midPoint = multiply3D(midPoint, length / length3D(midPoint));

    const finalEndPoint = add3D(startPoint, midPoint);
    const offsetEndPoint = add3D(endPoint, offsetVec);

    outArray[endIndex + 0] = offsetEndPoint[0];
    outArray[endIndex + 1] = offsetEndPoint[1];
    outArray[endIndex + 2] = offsetEndPoint[2];

    offsetVec = subtract3D(offsetVec, subtract3D(endPoint, finalEndPoint));

  }


  return outArray;
}
