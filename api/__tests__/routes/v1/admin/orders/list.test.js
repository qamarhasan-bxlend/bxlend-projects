"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/admin/orders";

it("should list Orders", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

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

  let marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2], {
    populated: true,
  });

  const { body } = await http()
    .get(endpoint)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  marketOrder.owner = user;
  marketOrder.wallets = [wallet1, wallet2];

  marketOrder = serializeDocument(marketOrder);

  delete marketOrder.owner.created_at;
  delete marketOrder.owner.updated_at;
  delete marketOrder.owner.password;

  marketOrder.wallets.forEach(wallet => {
    delete wallet.created_at;
    delete wallet.updated_at;
  });

  expect(body).toEqual({
    orders: [marketOrder],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });

});

it("should list 0 Order, if page doesn't exist", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

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

  await factory.marketOrder(user, pair, [wallet1, wallet2], {
    populated: true,
  });

  const { body } = await http()
    .get(endpoint)
    .query({
      page: 2,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    orders: [],
    meta: {
      page: 2,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should list only limited amount of Orders", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { orderBy } = require("lodash");

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

  const marketOrders = await Promise.all([
    factory.marketOrder(user, pair, [wallet1, wallet2], {
      populated: true,
    }),
    factory.marketOrder(user, pair, [wallet1, wallet2], {
      populated: true,
    }),
  ]);

  const { body } = await http()
    .get(endpoint)
    .query({
      limit: 1,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  let marketOrder = orderBy(marketOrders, ["id"], ["asc"])[0];

  marketOrder.owner = user;
  marketOrder.wallets = [wallet1, wallet2];

  marketOrder = serializeDocument(marketOrder);

  delete marketOrder.owner.created_at;
  delete marketOrder.owner.updated_at;
  delete marketOrder.owner.password;

  marketOrder.wallets.forEach(wallet => {
    delete wallet.created_at;
    delete wallet.updated_at;
  });

  expect(body).toEqual({
    orders: [marketOrder],
    meta: {
      page: 1,
      limit: 1,
      page_count: 2,
      total_count: 2,
    },
  });

});

it("should not be able to list all of the Orders", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

  const user = await factory.user();

  const accessToken = await factory.accessToken(user);

  const { body } = await http()
    .get(endpoint)
    .query({
      limit: 0,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.BAD_REQUEST);

  expect(body).toEqual({
    error: "bad-request",
    details: {
      limit: [
        "\"limit\" must be greater than or equal to 1",
      ],
    },
  });
});

it("should list Orders only with the selected fields", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");

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

  const marketOrder = await factory.marketOrder(user, pair, [wallet1, wallet2], {
    populated: true,
  });

  const select = ["id", "quantity"];

  const { body } = await http()
    .get(endpoint)
    .query({
      select,
    })
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  expect(body).toEqual({
    orders: [serializeDocument(marketOrder, select)],
    meta: {
      page: 1,
      limit: 10,
      page_count: 1,
      total_count: 1,
    },
  });
});

it("should respond with 401 in case of missing Authorization header", async () => {
  const { http } = require("@tests/internals");
  const { STATUS_CODE, ERROR } = require("@src/constants");

  const { body } = await http()
    .get(endpoint)
    .expect(STATUS_CODE.UNAUTHORIZED);

  expect(body).toEqual({ error: ERROR.ACCESS_TOKEN_MISSING });
});
