import * as Comlink from "comlink";

import { noise, draw } from "./helper";
import { calculateNormals, join } from "./geometry";

import createStemSkeleton from "./createStemSkeleton";
import createStemGeometry from "./createStemGeometry";
import createBranchSkeleton from "./createBranchSkeleton";
import createBranchGeometry from "./createBranchGeometry";

import leafGeometry from "../../assets/leaf.json";
import createLeaf from "./createLeaf";

let oldSettings: string;

const debugLines: Float32Array[] = [];
draw.setSkeleton(debugLines);

class Generator {
  constructor() {}

  generate(pd: plantDescription, settings: settings) {
    //If the settings change force regeneration of all parts
    const newSettings = JSON.stringify(settings);
    settings.forceUpdate = oldSettings !== newSettings;
    oldSettings = newSettings;

    //Load seed from settings
    if (settings.useRandomSeed === true) {
      noise.seed = Math.floor(Math.random() * 100000);
    } else if (typeof settings.seed === "number") {
      noise.seed = settings.seed;
    }

    //Create the stem skeletons
    debugLines.length = 0;
    const stemSkeletons = new Array(pd.stem.amount).fill(null).map((v, i) => createStemSkeleton(pd.stem, settings, i, pd.stem.amount));

    //Create the branch skeletons from the stem skeletons
    const branchSkeletons = stemSkeletons.map((skeleton, i) => createBranchSkeleton(pd.branches, skeleton, i));

    //Create the stem geometries from the stem skeletons
    const stemGeometries = stemSkeletons.map((skeleton, i) => createStemGeometry(pd.stem, settings, skeleton, i));

    //Create the branch geometries
    const branchGeometries = branchSkeletons.map((skeletons, i) => createBranchGeometry(pd, settings, skeletons, i));

    const final = calculateNormals(join(...stemGeometries.concat(branchGeometries)));

    final.skeleton = stemSkeletons.concat(debugLines, branchSkeletons.flat());

    final.leaf = calculateNormals(createLeaf(pd.leaves, settings, branchSkeletons, stemSkeletons));

    return final;
  }
}

Comlink.expose(Generator);

export default Generator;
