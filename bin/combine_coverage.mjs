

import { exec } from "child_process";
import { existsSync } from "fs"
import { rmdir, mkdir } from "fs/promises";
import combine from "istanbul-combine";

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

async function init() {

  const input = (await execute("yarn workspaces info")).match(/\{[\s\S]*\}/)[0];

  const data = JSON.parse(input);

  const packages = Object.entries(data).map(([key, entry]) => {
    return {
      name: key,
      loc: entry.location
    }
  });

  // Clean old coverage reports
  await rmdir("coverage", { recursive: true })
  await mkdir("coverage")

  // FIlter out packages with no coverage report
  const paths = packages
    .map(({ loc }) => loc + "/.nyc_output")
    .filter(loc => existsSync(loc))
    .map(loc => loc + "/*.json");

  // Combine all the found coverage reports
  combine({
    dir: 'coverage',                       // output directory for combined report(s)
    pattern: paths.join(" "),   // json reports to be combined 
    print: 'both',                      // print to the console (summary, detail, both, none) 
    base: 'sources',                        // base directory for resolving absolute paths, see karma bug
    reporters: {
      html: {},
    }
  }).then(console.log).catch(console.warn);

}

init();
