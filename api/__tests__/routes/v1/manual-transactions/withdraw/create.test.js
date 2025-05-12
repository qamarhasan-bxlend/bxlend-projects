"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/manual-transactions/withdraw";

it("should create a Manual Withdraw Transaction", async () => {
  const { factory, serializeDocument, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { ManualWithdrawTransaction } = require("@src/models");
  const faker = require("faker");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  const accessToken = await factory.accessToken(user);

  const datas = {
    quantity: faker.finance.amount(),
    from: wallet._id,
    to: wallet._id,
    currency_code: currency.code,
  };

  const { body } = await http()
    .post(endpoint)
    .send(datas)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const manual_transactions = await ManualWithdrawTransaction.find({});
  const manual_transaction = manual_transactions[0];

  expect(body).toEqual({ manual_transaction: serializeDocument(manual_transaction) });

});
