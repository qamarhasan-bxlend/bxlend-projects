"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/orders";

it("should create a Market Order information", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE, ORDER_KIND, ORDER_DIRECTION, ORDER_STATUS } = require("@src/constants");
  const { omit } = require("lodash");
  const faker = require("faker");

  const [user, currency1, currency2] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency({
      code: "ETH",
      name: "Ethereum",
    }),
    factory.cryptoCurrency(),
  ]);

  const [accessToken, currencyPair] = await Promise.all([
    factory.accessToken(user),
    factory.currencyPair([currency1, currency2]),
    factory.internalWallet(currency1),
    factory.internalWallet(currency2),
  ]);

  let creatingData = {
    "direction": ORDER_DIRECTION.BUY,
    "type": ORDER_KIND.MARKET,
    "quantity": faker.finance.amount(0),
  };
  const originCurrency = currency1;
  await factory.cryptoWallet(user, originCurrency, {
    balance: faker.finance.amount(creatingData.quantity),
  });

  const { body } = await http()
    .post(`${ endpoint }/${ currencyPair._id }`)
    .send(creatingData)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  creatingData = {
    quantity: creatingData.quantity,
    direction: creatingData.direction.toUpperCase(),
    status: ORDER_STATUS.ACTIVE,
    pair: currencyPair.symbol,
    owner: user._id.toString(),
    fee: {
      amount: "0",
      percentage: 0,
    },
  };

  const order = omit(body.order, ["wallets", "updated_at", "created_at", "owner_type"]);

  expect(order).toEqual(serializeDocument(creatingData));
});
