const { get_websocket } = require("@src/lib/Scrypt/index");
var moment = require('moment');

function microsTimestampStr() {
  return moment().utc().format('YYYY-MM-DDTHH:mm:ss') + '.000000Z';
}

function create(payload){
  const {Side, OrdType, OrderQty, ClOrdID, currency_codes, Currency} = payload;
  let scrypt_webSocket = get_websocket();
  var utc_datetime = microsTimestampStr();
  scrypt_webSocket.send(
    JSON.stringify({
        "type": "NewOrderSingle",
        "data": [
          {
            "Symbol": currency_codes[0]+"-"+currency_codes[1],
            "ClOrdID": ClOrdID,
            "Side": Side,
            "TransactTime": utc_datetime,
            "OrderQty": OrderQty,
            "OrdType": OrdType,
            // "Price": "43000",
            "Currency": Currency,
            "TimeInForce": "FillAndKill",
            // "Strategy": OrdType,
            "Parameters": {
              "ErrorAction": "Pause"
            }
          }
        ]
    })
  );
}

function update(payload){ //TODO
  socket.send(JSON.stringify(payload));
}

function cancel(payload){ //TODO
  socket.send(JSON.stringify(payload));
}
module.exports = {
  create,
};