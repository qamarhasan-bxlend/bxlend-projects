"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should respond with package name and version", async () => {
  const { http } = require("@tests/internals");
  const { name, version } = require("@root/package.json");
  const { STATUS_CODE } = require("@src/constants");

  const { body } = await http()
    .get("/")
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ name, version });
});

it("should respond with 404 status code", async () => {
  const { http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const { body } = await http()
    .get("/not-found")
    .expect(STATUS_CODE.NOT_FOUND);

  expect(body).toEqual({ error: "invalid_request", error_description: "unrecognized route or not allowed method (GET on /not-found)" });
});
