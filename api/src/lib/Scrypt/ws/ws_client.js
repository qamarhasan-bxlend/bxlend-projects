const { OrderBook, CurrencyConversion, Order } = require("@src/events");
const { Order:OrderModel, Wallet } = require("@src/models");
const { get_ws_options } = require("@src/lib/Scrypt/helpers/headers")
var Websocket = require('ws');
var logUpdate = require('log-update');
const columnify = require('columnify');
const colors = require('colors');
const { BigNumber } = require("@src/lib");

let debug = false;
let maxSizeLength = 0;
const {
    SCRYPT_ORDER_STATUS,
    ORDER_DIRECTION
  } = require("@src/constants");

const { SCRYPT_WS_URI, SCRYPT_API_KEY, SCRYPT_API_SECRET } = require("@src/config");

let scrypt_ws;

// Defining key
const secret = SCRYPT_API_SECRET;
const api_key = SCRYPT_API_KEY
const url = SCRYPT_WS_URI;

function generateOrderbook(response) {
    const bids = response['data'][0]['Bids'];
    if (!response.data || bids.length < 0) {
        console.log('No bids/offers in response: ', response);
        return '';
    }
    const offers = response['data'][0]['Offers'];
    const symbol = response['data'][0]['Symbol'];
    const columnData = [];
    let orderBookStr = symbol + ' OrderBook\n';
    for (let i = 0; i < Math.min(bids.length, offers.length); i++) {
        if (bids[i].hasOwnProperty('Size') && bids[i]['Size'].length > maxSizeLength) {
            maxSizeLength = bids[i]['Size'].length;
        }

        if (offers[i].hasOwnProperty('Size') && offers[i]['Size'].length > maxSizeLength) {
            maxSizeLength = offers[i]['Size'].length;
        }
        // Generates an order book string that like below:
        // Bids                    Offers
        //      0.123  7500.52            0.456 7501.50
        //      0.123  7500.52            0.456 7501.50
        //      0.123  7500.52            0.456 7501.50
        // ....
        columnData.push({
            padBids: '',
            bidsSize: bids[i]['Size'],
            bids: colors.green(bids[i]['Price']),

            middlePad: '',

            padOffers: '',
            offers: colors.red(offers[i]['Price']),
            offersSize: offers[i]['Size'],
        });
    }

    const columnConfig = {
        minWidth: 'Bids'.length,
        align: 'right',
        config: {
            padBids: { headingTransform: () => 'Bids' },
            bids: { showHeaders: false },
            bidsSize: {
                showHeaders: false,
                minWidth: maxSizeLength,
            },

            middlePad: { showHeaders: false },

            padOffers: { headingTransform: () => 'Offers' },
            offers: { showHeaders: false },
            offersSize: {
                showHeaders: false,
                minWidth: maxSizeLength,
            },
        },
    };
    orderBookStr += columnify(columnData, columnConfig) + '\n';
    return orderBookStr;
}
function subscribeToMarketData(ws, currency_pairs = [], depth) {
    let streams = [];
    currency_pairs.forEach((symbol) => {
        streams.push({
            name: 'MarketDataSnapshot',
            Symbol: symbol,
            Depth: depth,
            Throttle: '1s',
        })
    })
    const req = {
        reqid: 1,
        type: 'subscribe',
        streams: streams,
    };
    if (debug) {
        console.log('>', JSON.stringify(req));
    }
    ws.send(JSON.stringify(req));
}

function subscribeToCurrencyConversion(ws, currencies = [], reqid) {

    const req = {
        reqid: reqid,
        type: 'subscribe',
        streams: [
            {
                name: "CurrencyConversion",
                EquivalentCurrency: "USDT",
                Currencies: currencies
            }
        ],
    };
    if (debug) {
        console.log('>', JSON.stringify(req));
    }
    ws.send(JSON.stringify(req));
}

function subscribeToExecutionReport(ws, currencies = [], reqid) {

    const req = {
        reqid: reqid,
        type: 'subscribe',
        streams: [
            {
                name: "ExecutionReport"
            }
        ],
    };
    if (debug) {
        console.log('>', JSON.stringify(req));
    }
    ws.send(JSON.stringify(req));
}

function subscribeToTrade(ws, reqid) {

    const req = {
        reqid: reqid,
        type: 'subscribe',
        streams: [
            {
                name: "Trade"
            }
        ],
    };
    if (debug) {
        console.log('>', JSON.stringify(req));
    }
    ws.send(JSON.stringify(req));
}

function subscribeToOrder(ws, reqid) {

    const req = {
        reqid: reqid,
        type: 'subscribe',
        streams: [
            {
                name: "Order"
            }
        ],
    };
    if (debug) {
        console.log('>', JSON.stringify(req));
    }
    ws.send(JSON.stringify(req));
}

function subscribeToSecurity(ws, reqid) {

    const req = {
        reqid: reqid,
        type: 'subscribe',
        streams: [
            {
                name: "Security"
            }
        ],
    };
    if (debug) {
        console.log('>', JSON.stringify(req));
    }
    ws.send(JSON.stringify(req));
}

function connect(url, apikey, apisecret) {
    const options = get_ws_options(url, apikey, apisecret)
    return new Websocket(url, null, options);
}

async function updateOrder(order_data = {}, OrderEvent){
    console.log(order_data)
    const order = await OrderModel.findOne({
        _id: order_data['ClOrdID']
    });
    if (order){
        order.scrypt_data = {
            transaction_time: Date(order_data['Timestamp']),
            order_id: order_data['OrderID']
        }
        //TODO: cater all scrypt statuses
        order.status = SCRYPT_ORDER_STATUS[order_data['OrdStatus']]
        if(order.direction == ORDER_DIRECTION.BUY){
            switch (order_data['OrdStatus']) {
                case 'PendingNew':
                    // TODO:
                    break;
                case 'New':
                    // TODO:
                    break;
                case 'Filled':
                    // TODO: Add coins to users destination Wallet
                    let destinationWallet = await Wallet.findOne({
                        _id: order.wallets[1]
                    });
                    if(destinationWallet){
                        order.quantity = order_data['CumAmt'];
                        order.executed_price = order_data['AvgPx'];
                        destinationWallet.available_balance = new BigNumber(destinationWallet.available_balance).plus(order_data['CumAmt']).toFixed();
                        destinationWallet.save()
                    }
                    break;
                case 'Canceled':
                    // TODO: Add coins to users Origin Wallet
                    break;
                case 'Rejected':
                    // TODO: Add coins to users Origin Wallet
                    break;
            }
        }else{
            switch (order_data['OrdStatus']) {
                case 'PendingNew':
                    // TODO:
                    break;
                case 'New':
                    // TODO:
                    break;
                case 'Filled':
                    // TODO: Add coins to users destination Wallet
                    let destinationWallet = await Wallet.findOne({
                        _id: order.wallets[1]
                    });
                    order.quantity = order_data['CumAmt'];
                    order.executed_price = order_data['AvgPx'];
                    destinationWallet.available_balance = new BigNumber(destinationWallet.available_balance).plus(order_data['CumAmt']).toFixed();
                    destinationWallet.save()
                    break;
                case 'Canceled':
                    // TODO: Add coins to users Origin Wallet
                    break;
                case 'Rejected':
                    // TODO: Add coins to users Origin Wallet
                    break;
            }
        }
        

        await order.save();
        OrderEvent.emit("",order)
    }
    else{
        // TODO: Log info 
    }
}

function connectToScrypt() {
    const ws = connect(url, api_key, secret);

    ws.on('open', () => {
        var currency_pairs = [
            "BTC-USDT",
            "ETH-USDT"
        ]
        var currencies = [
            "BTC",
            "ETH"
        ]
        subscribeToMarketData(ws, currency_pairs, 10);
        console.log("Subscribed to scrypt market data");
        subscribeToCurrencyConversion(ws, currencies, 20)
        console.log("Subscribed to scrypt currencies");
        subscribeToExecutionReport(ws, [], 30);
        console.log("Subscribed to scrypt execution reports");
        subscribeToTrade(ws, 40);
        console.log("Subscribed to scrypt trades");
        subscribeToOrder(ws, 50);
        console.log("Subscribed to scrypt orders");
        // subscribeToSecurity(ws, 60);
        // console.log("Subscribed to scrypt securities");

        // ws.send('Connected to scrypt');

    });

    ws.on('message', async (data) => {
        if (debug) {
            console.log(data);
        }

        const response = JSON.parse(data);
        // console.log(response)
        switch (response.type) {
            case 'MarketDataSnapshot':
                OrderBook.emit(response['data'][0]['Symbol'], response['data']);
                break;
            case 'CurrencyConversion':
                CurrencyConversion.emit("",response['data'])
                console.log(response)
                break;
            case 'ExecutionReport':
                await updateOrder(response['data'].slice(-1)[0], Order)
                break;
            case 'Trade':
                Order.emit("",response)
                // console.log(response)
                break;
            case 'Order':
                Order.emit("",response)
                // console.log(response)
                break;
            case 'Security':
                console.log(response)
                break;
            case 'error':
                throw new Error(response['error']['msg']);
            default:
                if (debug) {
                    console.log('<', data);
                }
        }

    });

    ws.on('error', (err) => {
        console.log('got an error: ', err);
    });
    return ws;
}

function get_websocket(){
    if (scrypt_ws==undefined){
        scrypt_ws = connectToScrypt();
    }
    return scrypt_ws;
}

module.exports = { get_websocket: get_websocket };