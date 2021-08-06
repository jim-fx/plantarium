#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const { exec } = require('child_process');
const { existsSync } = require('fs');
const { rm, mkdir } = require('fs/promises');
const { relative } = require('path');
const { createCoverageMap } = require('istanbul-lib-coverage');
const { createContext } = require('istanbul-lib-report');
const createReport = require('istanbul-reports').create;

const execute = (command) =>
  new Promise((resolve, reject) => {
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

const clear = async (path) => {
  existsSync(path) && (await rm(path, { recursive: true }));
  await mkdir(path);
};

async function init() {
  // Clean old coverage reports
  await clear('.nyc_output');
  await clear('coverage');

  const input = await execute(
    'pnpm ls -r --depth -1 --long --parseable --filter "!@plantarium/root"',
  );

  const packages = input
    .split('\n')
    .filter((line) => line.length > 1)
    .map((line) => {
      let [packagePath, packageName] = line.split('@');
      packagePath = packagePath.replace(':', '');

      packageName = '@' + packageName;
      return {
        name: packageName,
        absPath: packagePath,
        path: relative(process.cwd(), packagePath),
      };
    })
    .filter(({ path }) => existsSync(path + '/.nyc_output'));

  generateMonorepoReport(packages);
}

init();

async function generateMonorepoReport(projects) {
  // Build a coverage map containing coverage from all projects
  const coverageMap = createCoverageMap({});
  for (let project of projects) {
    const coverageData = JSON.parse(
      fs.readFileSync(`${project.path}/coverage/coverage-final.json`),
    );
    coverageMap.merge(coverageData);
  }

  // Specify the output folder for the HTML report (in this case, we'll write to the 'coverage' folder
  // in the root of the monorepo).
  const context = createContext({
    dir: 'coverage',
    coverageMap: coverageMap,
  });

  console.table(projects);

  // Create and execute the report, passing in the expected options
  const htmlReport = createReport('istanbul-reporter-html-monorepo', {
    reportTitle: '@Plantarium/',
    projects: projects.map((p) => ({
      path: p.path.replace('packages/', ''),
      name: p.name.replace('@plantarium/', ''),
    })),
    relative: true,
    defaultProjectName: false,
  });
  htmlReport.execute(context);

  createReport('lcov').execute(context);
}
