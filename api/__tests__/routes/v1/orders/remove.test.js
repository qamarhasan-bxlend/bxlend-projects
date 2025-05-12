"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/orders";

it("should remove the Order by id", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE, STATUS_MESSAGE } = require("@src/constants");
  const { Order } = require("@src/models");

  const [user, cryptoCurrency1, cryptoCurrency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
    factory.cryptoCurrency(),
  ]);

  const [accessToken, wallet1, wallet2, pair] = await Promise.all([
    factory.accessToken(user),
    factory.cryptoWallet(user, cryptoCurrency1),
    factory.cryptoWallet(user, cryptoCurrency2),
    factory.currencyPair([cryptoCurrency1, cryptoCurrency2]),
  ]);

  let marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2]);

  const { body } = await http()
    .delete(`${ endpoint }/${ marketOrder.id }`)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({ message: STATUS_MESSAGE.OK });

  const orders = await Order.find({});
  const order = orders[0];

  expect(order.deleted_at).toBeTruthy();

});
