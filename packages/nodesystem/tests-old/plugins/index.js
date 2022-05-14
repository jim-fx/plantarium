// cypress/plugins/index.js
module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);
  // include any other plugin code...

  // It's IMPORTANT to return the config object
  // with any changed environment variables
  return config;
};
