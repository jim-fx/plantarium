//Generator part
import { noise, draw, convertInstancedGeometry } from "./helper";
import { calculateNormals, join } from "./geometry";

import createStemSkeleton from "./createStemSkeleton";
import createStemGeometry from "./createStemGeometry";
import createBranchSkeleton from "./createBranchSkeleton";
import createBranchGeometry from "./createBranchGeometry";
import createLeaves from "./createLeaves";

const debugLines: Float32Array[] = [];
draw.setSkeleton(debugLines);

export default (pd: plantDescription, settings: settings, instanceLeafs: boolean = true) => {
  //If the settings change force regeneration of all parts
  /*const newSettings = JSON.stringify(settings);
  settings.forceUpdate = oldSettings !== newSettings;
  oldSettings = newSettings;*/

  //Load seed from settings
  if (settings.useRandomSeed === true) {
    noise.seed = Math.floor(Math.random() * 100000);
  } else if (typeof settings.seed === "number") {
    noise.seed = settings.seed;
  }

  const skeletons: Float32Array[] = [];
  let leaf: LeafGeometry;
  let branchSkeletons: Float32Array[][] = [];

  //Create the stem skeletons
  debugLines.length = 0;
  const stemSkeletons = new Array(pd.stem.amount).fill(null).map((v, i) => createStemSkeleton(pd.stem, settings, i, pd.stem.amount));

  //Create the stem geometries from the stem skeletons
  const geometries = stemSkeletons.map((skeleton, i) => createStemGeometry(pd.stem, settings, skeleton, i));

  if (pd.branches.enable) {
    //Create the branch skeletons from the stem skeletons
    branchSkeletons = stemSkeletons.map((skeleton, i) => createBranchSkeleton(pd.branches, skeleton, i));

    //Create the branch geometries
    const branchGeometries = branchSkeletons.map((skeletons, i) => createBranchGeometry(pd, settings, skeletons, i));

    geometries.push(...branchGeometries);
    skeletons.push(...branchSkeletons.flat());
  }

  if (pd.leaves.enable) {
    leaf = <InstancedGeometry>calculateNormals(createLeaves(pd.leaves, settings, branchSkeletons, stemSkeletons));
  }

  if (!instanceLeafs) {
    geometries.push(...convertInstancedGeometry(leaf));
  }

  const final = calculateNormals(join(...geometries));

  if (instanceLeafs) {
    final.leaf = leaf;
  }

  skeletons.push(...debugLines);
  skeletons.push(...stemSkeletons);
  final.skeleton = skeletons;

  return final;
};
