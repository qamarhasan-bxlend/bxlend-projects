const client = require("../client");
const errorHandler = require("../errorHandler");
const responseHandler = require("../responseHandler");

const { SCRYPT_HTTPS_URI, SCRYPT_API_KEY, SCRYPT_API_SECRET } = require("@src/config");
const { get_http_headers } = require("@src/lib/Scrypt/helpers/headers")
// Defining key
const secret = SCRYPT_API_SECRET;
const api_key = SCRYPT_API_KEY

async function getKLines() {
    try{
        let headers = get_http_headers("/v1/symbols/BTC-USDT/ohlcv/1D?startDate=2021-02-13T05:17:32.000000Z&endDate=2021-02-15T05:17:32.000000Z", api_key, secret)
        const config = {
            headers:headers
        };
        const resp = await responseHandler(client.get('/v1/symbols/BTC-USDT/ohlcv/1D?startDate=2021-02-13T05:17:32.000000Z&endDate=2021-02-15T05:17:32.000000Z', config));
        // console.log(resp.data)
        return resp.data;
    }catch(error){
        console.log(error)
        errorHandler(error)
    }
    // return responseHandler(client.get(''));
}

module.exports = {
    getKLines
};
  