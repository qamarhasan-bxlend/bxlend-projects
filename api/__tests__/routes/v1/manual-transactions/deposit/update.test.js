"use strict";

/* eslint-env jest */

/* ------------------------- TESTS ------------------------- */

const endpoint = "/v1/manual-transactions/deposit";

it("should update a Manual Deposit Transaction", async () => {
  const { factory, http } = require("@tests/internals");
  const { STATUS_CODE } = require("@src/constants");
  const { ManualDepositTransaction } = require("@src/models");
  const faker = require("faker");

  const [user, currency] = await Promise.all([
    factory.user(),
    factory.cryptoCurrency(),
  ]);

  const wallet = await factory.cryptoWallet(user, currency);
  let manual_transaction_created = await factory.manualDepositTransaction(user, wallet, currency, 0);
  const accessToken = await factory.accessToken(user);

  const changingProperty = "quantity";
  const changingValue = faker.finance.amount();

  manual_transaction_created = JSON.parse(JSON.stringify(manual_transaction_created));

  manual_transaction_created[changingProperty] = changingValue;
  delete manual_transaction_created.updated_at;
  delete manual_transaction_created.created_at;

  await http()
    .patch(`${ endpoint }/${ manual_transaction_created.id }`)
    .field(changingProperty, changingValue)
    .set("Authorization", `Bearer ${ accessToken.jti }`)
    .expect(STATUS_CODE.OK);

  const manual_transactions = await ManualDepositTransaction.find({});
  const manual_transaction = JSON.parse(JSON.stringify(manual_transactions[0]));
  delete manual_transaction.updated_at;
  delete manual_transaction.created_at;

  expect(manual_transaction).toEqual(manual_transaction_created);

});
