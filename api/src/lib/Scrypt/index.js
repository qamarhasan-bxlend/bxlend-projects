const {
    ws_client
} = require('./ws')
const {
    getKLines
} = require("./helpers/klines")

module.exports = {
    get_websocket: ws_client.get_websocket,
    getKLines: getKLines
};