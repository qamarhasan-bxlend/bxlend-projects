//// Uncomment from  `use strict` till end and run `node swagger.js` in terminal  
//// this will create swaggerOutput.js with one slight error so write `module.exports = ` in the begining of the file
//// this will resolve the syntax error. now open  `localhost:3001/api-docs to understand the routes of this repo

// "use strict";

// const pkg = require("./package.json");
// const swaggerAutogen = require('swagger-autogen')();


// const doc = {
//   swagger: "0.7.5",
//   info: {
//     title: pkg.name,
//     version: pkg.version,
//     description: pkg.description,
//     contact: {
//       name: "API Support",
//       email: "developers@btcex.pro",
//     },
//   },
//   host: "localhost:3001",
//   schemes: [
//     "http"
//   ],
//   servers: [
//     {
//       url: "http://localhost:3001"
//     }
//   ]
// };


// const outputFile = './swaggerOutput.js'
// const routes = ['./src/routes/index.js']

// swaggerAutogen(outputFile, routes, doc)