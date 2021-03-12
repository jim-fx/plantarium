#!/usr/bin/env node

import { exec } from "child_process";
import { existsSync } from "fs"
import { rmdir, mkdir } from "fs/promises";

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

const wait = time => new Promise((res) => setTimeout(res, time));

const clear = async path => {
  await rmdir(".nyc_output", { recursive: true })
  await mkdir(".nyc_output")
}

async function init() {

  // Clean old coverage reports
  await clear(".nyc_output");

  const input = (await execute("yarn workspaces info")).match(/\{[\s\S]*\}/)[0];

  const data = JSON.parse(input);

  const packages = Object.entries(data).map(([key, entry]) => {
    return {
      name: key,
      nycOutputFolder: entry.location + "/.nyc_output"
    }
  }).filter(pkg => existsSync(pkg.nycOutputFolder));


  await Promise.all(packages.map(({ nycOutputFolder }) => execute(`yarn nyc merge ${nycOutputFolder} .nyc_output/combined.json`)));

}

init();
