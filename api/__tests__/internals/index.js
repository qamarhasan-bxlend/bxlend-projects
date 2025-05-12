"use strict";

const server = require("@src/server");
const { hasOwnProperty } = require("@src/utils");
const supertest = require("supertest");

exports.factory = require("./factories");

exports.serializeDocument = function serializeDocument(document, fields = []) {
  if (Array.isArray(document)) return document.map(item => serializeDocument(item, fields));

  const serialized = JSON.parse(JSON.stringify(document));

  if (fields.length > 0) {
    for (const field in serialized) {
      if (!hasOwnProperty(serialized, field)) continue;

      if (!fields.includes(field)) delete serialized[field];
    }
  }

  return serialized;
};

exports.http = function httpRequest() {
  return supertest(server);
};
