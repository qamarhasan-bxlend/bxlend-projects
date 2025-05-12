"use strict";

const { Order } = require("@src/events");
const { wrapAsyncFn } = require("@src/utils");

module.exports = async function streamOrderWSController(req, res) {

  const listener = wrapAsyncFn(async (data) => {
    res.send(data)
  });

  Order.on("",listener);

  req.once("closed", () => Order.off("",listener));
};
