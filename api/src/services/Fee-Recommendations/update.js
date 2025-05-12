"use strict";

const { TransactionFee, Currency, InternalWallet } = require("@root/src/models");
const { CryptoApis } = require("@src/lib");
const cron = require("node-cron");
const { CRYPTO_WALLET_PLATFORM } = require("@src/constants");
const { BigNumber } = require("@src/lib");
const { Types } = require("mongoose");

const cronSchedule = "*/1 * * * *"; // Runs every hour at minute 0


cron.schedule(cronSchedule, async () => {
  try {
    const currencies = await Currency.find({
      kind: "CRYPTO",
      crypto_type: "coin"
    })
    const cryptoApiWallets = await InternalWallet.find({
      platform: CRYPTO_WALLET_PLATFORM.CRYPTOAPIS
    });
    // console.log(currencies)
    // return 

    for (const wallet of cryptoApiWallets) {

      const blockchain = wallet.platform_options.blockchain.toLowerCase().replace(/\s+/g, '-');
      const network =  wallet.platform_options.network.toLowerCase();
      if (!blockchain || !network) {
        console.log('could not find name and network')
      }
      else {
        // console.log('data going is', blockchain, network)
        const feeData = await CryptoApis.getFeeRecommendation(blockchain, network);
        if (!feeData) {
          console.log('could not fetch fee')
        }
        else {
          const fee = feeData.data.item
          console.log('fee ', fee)
          const updateFee = await TransactionFee.findOneAndUpdate({
            unit: fee.unit,
            network: network,
          }, {
            fast_fee: fee.fast,
            code: blockchain,
            slow_fee: fee.slow,
            standard_fee: fee.standard,
            unit: fee.unit,
            network: network,
          }, { new: true, upsert: true }
          );
          console.log(`Updated Fee for ${blockchain} ${network} ${Types.Decimal128.fromString("0.00000015")}`)
        }
      }
    }
    // for (const currency of currencies) {

    //   const blockchain = currency.name.toLowerCase().replace(/\s+/g, '-');
    //   const network = currency.networks[0].toLowerCase();
    //   if (!blockchain || !network) {
    //     console.log('could not find name and network')
    //   }
    //   else {
    //     // console.log('data going is', blockchain, network)
    //     const feeData = await CryptoApis.getFeeRecommendation(blockchain, network);
    //     if (!feeData) {
    //       console.log('could not fetch fee')
    //     }
    //     else {
    //       const fee = feeData.data.item
    //       // console.log('fee ', fee)
    //       const updateFee = await TransactionFee.findOneAndUpdate({
    //         unit: fee.unit,
    //         network: network,
    //       }, {
    //         fast_fee: fee.fast,
    //         code: blockchain,
    //         slow_fee: fee.slow,
    //         standard_fee: fee.standard,
    //         unit: fee.unit,
    //         network: network,
    //       }, { new: true, upsert: true }
    //       );
    //       console.log(`Updated Fee for ${blockchain} ${network}`)
    //     }
    //   }
    // }
  }
  catch (error) {
    // console.error(error);
    console.log("Error in fetching.");
  }
});
