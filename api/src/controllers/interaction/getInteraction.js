"use strict";

const { OpenIDConnect } = require("@src/lib");
const { WEBSITE_CLIENT_URI, API_URI, API_PORT } = require('@src/config')
const { User } = require('@src/models');

const CONTROLLER = [
  async function getInteraction(req, res, next) {
    const {
      uid, prompt, params, lastSubmission
    } = await OpenIDConnect.interactionDetails(req, res);

    const client = await OpenIDConnect.Client.find(params.client_id);

    const client_uri = API_URI == `http://localhost:${API_PORT}` ? WEBSITE_CLIENT_URI : `https://${WEBSITE_CLIENT_URI}`

    console.log("🚀 ~ getInteraction ~ client_uri:", client_uri)
    // TODO: temporary, remove after making auth, a separate service
    const prefix = "/auth";
    // const prefix = NODE_ENV === ENV.PRODUCTION ? "" : "/auth";

    switch (prompt.name) {
      case "login": {
        return res.render("screens/login", {
          error: null,
          client,
          uid,
          params,
          prefix,
          client_uri
        });
      }
      case "consent": {
        const accountId = lastSubmission.login.accountId;
        const { twoFA_verified } = await User.findById(accountId)

        return res.render("screens/consent", {
          error: null,
          client,
          uid,
          details: prompt.details,
          params,
          prefix,
          twoFA_verified
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
