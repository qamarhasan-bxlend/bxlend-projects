// "use strict";

// const { Setting } = require("@src/models");
// const { loopWhile } = require("deasync");

// const SETTINGS = {};

// let loaded = false;

// Setting
//   .find()
//   .then((settings) => {
//     settings.forEach((setting) => SETTINGS[setting.name] = setting.value);

//     loaded = true;
//   })
//   .catch((error) => {
//     console.error(error);

//     process.exit(1);
//   });

// loopWhile(() => !loaded);

// module.exports = SETTINGS;
