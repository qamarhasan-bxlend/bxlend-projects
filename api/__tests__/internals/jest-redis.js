"use strict";

const { RedisMemoryServer } = require("redis-memory-server");

const REDISD = new RedisMemoryServer({
  autoStart: false,
  binary: {
    version: "6.2.5",
  },
});

module.exports = REDISD;
