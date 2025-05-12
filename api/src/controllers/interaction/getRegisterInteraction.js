"use strict";

const { OpenIDConnect } = require("@src/lib");
const { WEBSITE_CLIENT_URI } = require('@src/config')

const CONTROLLER = [
  async function getRegisterInteraction(req, res, next) {
    const {
      uid, prompt, params,
    } = await OpenIDConnect.interactionDetails(req, res);

    const client = await OpenIDConnect.Client.find(params.client_id);

    // res.redirect(WEBSITE_CLIENT_URI) // delete this line once the website is live for market

    switch (prompt.name) {
      case "login": {
        return res.render("screens/register", {
          client,
          error: null,
          uid,
          params,
          // TODO: temporary, remove after making auth, a separate service
          prefix: "/auth",
          // prefix: NODE_ENV === ENV.PRODUCTION ? "" : "/auth",
        });
      }
      /* istanbul ignore next */
      default: {
        next();
      }
    }
  },
];

module.exports = CONTROLLER;
