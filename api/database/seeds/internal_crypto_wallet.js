"use strict";

const Bitgo = require("@src/lib/Bitgo");
const { InternalWallet } = require("@src/models");

exports.name = "internal_crypto_wallet";

exports.run = async function run() {
  await InternalWallet.deleteMany({
    "platform_options.label": "btcex-test",
  });

  let { wallets } = await Bitgo.getAllWallets();

  wallets = wallets.filter((wallet) => wallet.platform_options.label === "btcex-test");

  for (const wallet of wallets) {
    const { label, coin, id } = wallet;

    const { addresses } = await Bitgo.getAllWalletAddresses(coin, id);

    await InternalWallet.create({
      platform_id: id,
      platform_options: {
        label,
        currency_code: coin,
      },
      address: addresses[0].address,
      currency_code: coin.substring(1).toUpperCase(),
      balance: 0,
    });
  }
};
