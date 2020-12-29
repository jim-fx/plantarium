

const { exec } = require("child_process");

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

  console.log(process.env);

  const input = await execute("yarn workspaces info");

  const data = JSON.parse(input);

  const packages = Object.entries(data).map(([key, entry]) => {

    return {
      name: key,
      loc: entry.location
    }

  });

  await execute("rm -rf coverage")
  await execute("mkdir -p coverage")

  const paths = await Promise.all(packages.map(({ loc }) => loc + "/.nyc_output/*.json"));

  await execute(`yarn istanbul-combine -d coverage -r html ${paths.join(" ")}`)

}

init();
