"use strict";

const { version } = require("@root/package.json");
const { NODE_ENV, RELEASE_ENV, SENTRY_DSN } = require("@src/config");
const { ENV } = require("@src/constants");
const routes = require("@src/routes");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const express = require("express");
const qs = require("qs");

// ------------------------- Server ---------------------------

const server = express();

// ------------------------- Sentry ---------------------------

/* istanbul ignore next */
if (NODE_ENV === ENV.PRODUCTION) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: RELEASE_ENV,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({
        app: server,
      }),
    ],
    tracesSampleRate: 1.0,
    profileSampleRate : 1.0,
    release: `v${ version }`,
  });
}

// ------------------------- Settings -------------------------

server.disable("x-powered-by");

server.enable("trust proxy");

server.set("view engine", "ejs");

server.set("query parser", qs.parse);

/* istanbul ignore next */
server.set("json replacer fn", (key, value) => {
  return key[0] === "_" ? undefined : value;
});

// ------------------------- Routes ---------------------------

server.use(routes);

// ------------------------- Exports --------------------------

module.exports = server;
