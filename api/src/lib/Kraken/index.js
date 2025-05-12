"use strict";

const {
    marketOrder,
    orderInfo,
} = require('./orders')

module.exports = {
    createMarketOrder: marketOrder.create,
    getOrderInfo: orderInfo.getInfo
}