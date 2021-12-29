const combine = require('istanbul-combine');

const opts = {
  dir: 'coverage', // output directory for combined report(s)
  pattern: 'packages/**/coverage/coverage-final.json', // json reports to be combined
  print: 'summary', // print to the console (summary, detail, both, none)
  base: '../packages', // base directory for resolving absolute paths, see karma bug
  reporters: {
    html: {},
    cobertura: {},
  },
};

(async () => {
  const res = await combine(opts);

  console.log(res);
})();
