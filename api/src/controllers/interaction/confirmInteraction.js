"use strict";

const { OpenIDConnect } = require("@src/lib");
const bodyParser = require("body-parser");
const { authenticator } = require('otplib');
const { User } = require('@src/models');
const { WEBSITE_CLIENT_REDIRECT_URI } = require('@src/config')


const CONTROLLER = [
  bodyParser.urlencoded({ extended: true }),
  async function confirmInteraction(req, res) {
    const interactionDetails = await OpenIDConnect.interactionDetails(req, res);
    const { prompt: { name, details }, params, session: { accountId }, uid } = interactionDetails;

    const prefix = "/auth";
    if (name !== "consent") throw new Error(`Unexpected Prompt: ${name}`);
    const client = await OpenIDConnect.Client.find(params.client_id);
    const { twoFA_verified, secret } = await User.findById(accountId)
    try {
      if (twoFA_verified) {
        const { twoFACode } = req.body;
        const check_auth = authenticator.check(twoFACode, secret);
        if (!check_auth)
          throw new Error("Invalid 2FA Code !")
      }
      let { grantId } = interactionDetails;
      let grant;

      if (grantId) {
        // we'll be modifying existing grant in existing session
        grant = await OpenIDConnect.Grant.find(grantId);
      } else {
        // we're establishing a new grant
        grant = new OpenIDConnect.Grant({
          accountId,
          clientId: params.client_id,
        });
      }

      if (details.missingOIDCScope) {
        grant.addOIDCScope(details.missingOIDCScope.join(" "));
      }
      if (details.missingOIDCClaims) {
        grant.addOIDCClaims(details.missingOIDCClaims);
      }
      if (details.missingResourceScopes) {
        // eslint-disable-next-line no-restricted-syntax
        for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
          grant.addResourceScope(indicator, scopes.join(" "));
        }
      }

      grantId = await grant.save();

      const consent = {};
      if (!interactionDetails.grantId) {
        // we don't have to pass grantId to consent, we're just modifying existing one
        consent.grantId = grantId;
      }

      const result = { consent };

      await OpenIDConnect.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
    }
    catch (error) {
      return res.render("screens/consent", {
        error: 'Invalid 2FA Code !',
        client,
        uid,
        details: details,
        params,
        prefix,
        twoFA_verified
      });

    }
  }
];

module.exports = CONTROLLER;
