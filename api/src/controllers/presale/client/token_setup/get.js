
"use strict";
const {
  PresaleTokenSetup
} = require("@src/models");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
  bodyParser.json(),
  async function listTokenSetupV1Controller(req, res) {
    try {
      const tokenSetups = await PresaleTokenSetup.find({
        deleted_at: { $exists: false }
      })
      if (!tokenSetups) {
        res.status(500).send({ message: "could not fetch tokens' setup" })
      }
      res.json({ token_setups: tokenSetups })

    } catch (err) {
      console.log(err)
      return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
        message: err?.message ?? err
      })

    }
  }
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
