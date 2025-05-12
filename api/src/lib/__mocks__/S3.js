"use strict";

/* eslint-env jest */

const faker = require("faker");

// ------------------------- Library -------------------------

exports.upload = jest.fn()
  .mockName("upload")
  .mockImplementation(async (folder, extension) => `${ folder }/${ faker.datatype.uuid() }.${ extension }`);
