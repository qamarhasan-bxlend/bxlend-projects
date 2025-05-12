"use strict";

/* eslint-env jest */

beforeAll(async () => {
  const { connectDB, createDBCollections } = require("./database");

  await connectDB();

  await createDBCollections();
});

afterEach(async () => {
  const { resetDB } = require("./database");

  await resetDB();
});

afterEach(async () => {
  const { trade } = require("@src/queue");

  await Promise.all(
    Object.values(trade).map(queue => queue.close(true)),
  );
});

afterAll(async () => {
  const { disconnectDB } = require("./database");

  await disconnectDB();
});
