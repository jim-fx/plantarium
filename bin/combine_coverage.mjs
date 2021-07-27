#!/usr/bin/env node

import { exec } from "child_process";
import { existsSync } from "fs"
import { rm, mkdir } from "fs/promises";

const execute = (command) => new Promise((resolve, reject) => {

  exec(command, (error, stdout, stderr) => {
    if (error) {
      reject(error);
      return;
    }
    if (stderr) {
      return;
    }

    resolve(stdout);
  });

});

//const wait = time => new Promise((res) => setTimeout(res, time));

const clear = async path => {
  existsSync(path) && await rm(path, { recursive: true })
  await mkdir(path)
}

async function init() {

  // Clean old coverage reports
  await clear(".nyc_output");

  const input = await execute("pnpm ls -r --depth -1 --long --parseable");

  const packages = input.split("\n").filter(line => line.length > 1).map(line => {
    console.log(line);
    let [packagePath, packageName] = line.split("@");
    packagePath = packagePath.replace(":", "");
    packageName = "@"+packageName.replace("/", "_");
    console.log(packagePath, packageName);

    return {
      name:packageName,
      nycOutputFolder: packagePath + "/.nyc_output"
    }
  }).filter(pkg => existsSync(pkg.nycOutputFolder));


  await Promise.all(packages.map(({ nycOutputFolder, name }) => execute(`pnpm nyc merge ${nycOutputFolder} .nyc_output/${name}.json`)));

}

init();
