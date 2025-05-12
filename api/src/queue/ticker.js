"use strict";

const { REDIS_URI } = require("@src/config");
const Scrypt = require("@src/lib/Scrypt");
const { CurrencyPair } = require("@src/models");
const Bull = require('bull');
const Sentry = require("@sentry/node");
const { loopWhile } = require("deasync");
const { createTicker } = require("@src/services");
const { DBTransaction } = require("@src/utils");

const cronJobInterval = '0 */1 * * * *'; // cron expression for running the job every 1 minutes

// ------------------------- Queue -------------------------

const QUEUE = {};

let loaded = false;

CurrencyPair
  .find({ deleted_at: { $exists: false } })
  .then((pairs) => {
    pairs.forEach((pair) => QUEUE[`${pair.currency_codes[0]}-${pair.currency_codes[1]}`] = new Bull(`ticker:${pair.currency_codes[0]}-${pair.currency_codes[1]}`, REDIS_URI));

    loaded = true;
  })
  .catch((error) => {
    console.error(error);

    process.exit(1);
  });

loopWhile(() => !loaded);

// ------------------------- Consumers -------------------------

// Object
//   .keys(QUEUE)
//   .forEach(async (symbol) => {
//     const Queue = QUEUE[symbol];

//     // ------------------------- Consumer -------------------------
//     console.log("helllo")
//     const job = await Queue.add({}, {
//       repeat: { cron: cronJobInterval }
//     });

//     // console.log(job)

//     Queue
//       .process( async function tickerQueue(job) {
//         // console.log(job.data);

//         console.log('Running my cron job at:', new Date());
//         // TODO: get the latest ticker of specific pair
//         const DBT = await DBTransaction.init();
//         // TODO: fetch tickers information from the api from scrypt from last fetched ticker to the latest one
//         // let scrypt_klines = await Scrypt.getKLines()
//         // let olhcv_data = scrypt_klines.data[0];

//         // console.log(olhcv_data)

//         // const newTicker = await createTicker({
//         //                   pair_symbol: olhcv_data['Symbol'],
//         //                   from: olhcv_data['Open'],
//         //                   to: olhcv_data['Close'],
//         //                   high: olhcv_data['High'],
//         //                   low: olhcv_data['Low'],
//         //                   time: olhcv_data['Timestamp']
//         //                 }, DBT)
        
//         await DBT.commit();
//         // return res.json(scrypt_klines)
//         // TODO: Create new ticker and add it to the database

//         // TODO: Send Notifications.
//       })
//       .catch((error) => {
//         console.log("error")
//         Sentry.captureException(error);
//       });

//     // ------------------------- Events -------------------------

//     // TODO: send the new received ticker to all connections
//     Queue.on(
//       "completed",
//       async () => console.log("compp"),
//     );
//   });

// ------------------------- Exports -------------------------

module.exports = QUEUE;

// queue.process(async (job) => {
// });

// module.exports = queue;