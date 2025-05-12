"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

describe("wrapController", () => {
  it("should catch sync function error", (done) => {
    const { wrapController } = require("@src/utils");

    const errorMessage = "test";

    function foo() {
      throw new Error(errorMessage);
    }

    wrapController(foo)(null, null, (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(errorMessage);

      done();
    });
  });

  it("should catch async function error", (done) => {
    const { wrapController } = require("@src/utils");

    const errorMessage = "test";

    async function foo() {
      throw new Error(errorMessage);
    }

    wrapController(foo)(null, null, (error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual(errorMessage);

      done();
    });
  });
});
