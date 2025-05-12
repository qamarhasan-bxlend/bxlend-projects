"use strict";

const { OpenIDConnect } = require("@src/lib");

const CONTROLLER = [
  async function abortInteraction(req, res) {
    const result = {
      error: "access_denied",
      error_description: "End-User aborted interaction",
    };

    await OpenIDConnect.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
  },
];

module.exports = CONTROLLER;
