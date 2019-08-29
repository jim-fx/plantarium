import { Vec3 } from "ogl";
import p from "./helper/parameter";

let skeleton: Vec3[] = [];
let oldDescription: string;

export default function(stem: stemDescription, settings: settings): Vec3[] {
  //Check if we need to regenerate
  const newDescription = JSON.stringify(stem);
  if (!settings.forceUpdate && oldDescription === newDescription && skeleton.length) {
    return skeleton;
  }

  const amountPoints = settings.stemResY || 8;
  skeleton.length = amountPoints;
  const stemHeight = p(stem.height);

  for (let i = 0; i < amountPoints; i++) {
    const a = i / amountPoints;
    skeleton[i] = new Vec3(0, a * stemHeight, 0);
  }

  return skeleton;
}
