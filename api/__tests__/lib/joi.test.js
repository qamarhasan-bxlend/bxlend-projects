"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

describe("ObjectId", () => {
  it("should validate successfully", () => {
    const { Joi } = require("@src/lib");
    const { Types } = require("mongoose");

    const objectId = Types.ObjectId();

    const { error, value } = Joi.string().objectId().validate(objectId.toString(), { abortEarly: false });

    expect(error).toBeUndefined();
    expect(value).toBeInstanceOf(Types.ObjectId);
    expect(value.toString()).toEqual(objectId.toString());
  });

  it("shouldn't validate in case of wrong input", () => {
    const { Joi } = require("@src/lib");

    const { error, value } = Joi.string().objectId().validate("#not$objectId", { abortEarly: false });

    expect(error).not.toBeUndefined();
    expect(error.message).toEqual("\"value\" must be a valid id");
    expect(value).toEqual("#not$objectId");
  });
});

describe("phoneNumber", () => {
  it("should validate successfully", () => {
    const { Joi } = require("@src/lib");

    const phoneNumber = "+12133734254";

    const { error, value } = Joi.string().phoneNumber().validate(phoneNumber, { abortEarly: false });

    expect(error).toBeUndefined();
    expect(value.number).toEqual(phoneNumber);
  });

  it("shouldn't validate in case of wrong input", () => {
    const { Joi } = require("@src/lib");

    const { error, value } = Joi.string().phoneNumber().validate("not-phone-number", { abortEarly: false });

    expect(error).not.toBeUndefined();
    expect(error.message).toEqual("\"value\" must be a valid phone number");
    expect(value).toEqual("not-phone-number");
  });
});

describe("numeric", () => {
  it("should validate successfully", () => {
    const { Joi } = require("@src/lib");

    const numeric = "123456";

    const { error, value } = Joi.string().numeric().validate(numeric, { abortEarly: false });

    expect(error).toBeUndefined();
    expect(value).toEqual(numeric);
  });

  it("shouldn't validate in case of wrong input", () => {
    const { Joi } = require("@src/lib");

    const { error, value } = Joi.string().numeric().validate("12-not-numeric-34", { abortEarly: false });

    expect(error).not.toBeUndefined();
    expect(error.message).toEqual("\"value\" must only contain numbers [0..9]");
    expect(value).toEqual("12-not-numeric-34");
  });
});
