"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

it("should return true when the given key is a direct object property", async () => {
  const { hasOwnProperty } = require("@src/utils");

  const object = {
    foo: "bar",
  };

  expect(hasOwnProperty(object, "foo")).toBe(true);
});
