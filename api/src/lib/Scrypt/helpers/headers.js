var moment = require('moment');
const crypto = require('crypto');
const { SCRYPT_HTTPS_URI, SCRYPT_API_KEY, SCRYPT_API_SECRET } = require("@src/config");

// Defining key
const secret = SCRYPT_API_SECRET;
const api_key = SCRYPT_API_KEY
const https_url = SCRYPT_HTTPS_URI;


function generateSignature(method, nowStr, host, path, secret, query=undefined) {
    let params = [];
    if(query){
        const queryString = Array.from(query).map((param) => {
            return `${param[0]}=${param[1]}`;
        }).join('&');
        params = [method, nowStr, host, path, queryString].join('\n')
        console.l
    }
    else{
        params = [method, nowStr, host, path].join('\n')
    }
    // if(query){
    //     params = params + [,query]
    // }
    console.log(query)
    console.log(params)
    // params = params.join('\n');
    // Make URI friendly by replacing '/' & '+'
    return crypto
        .createHmac('sha256', secret)
        .update(params)
        .digest('base64')
        .replace(/\//g, '_')
        .replace(/\+/g, '-');
}

function microsTimestampStr() {
    return moment().utc().format('YYYY-MM-DDTHH:mm:ss') + '.000000Z';
}

function get_ws_options(url, apikey, apisecret){
    const uri = new URL(url);
    const host = uri.host;
    const path = uri.pathname;
    const nowStr = microsTimestampStr();
    const method = 'GET';
    const signature = generateSignature(
        method,
        nowStr,
        host,
        path,
        apisecret,
    );
    // console.log("connecting with scrypt")
    const options = {
        headers: {
            'ApiKey': apikey,
            'ApiSign': signature,
            'ApiTimestamp': nowStr,
        },
    };

    return options;
}

function get_http_headers(url, apikey, apisecret){
    const uri = new URL(https_url+url);
    const host = uri.host;
    const path = uri.pathname;
    const query = uri.searchParams;
    const nowStr = microsTimestampStr();
    const method = 'GET';
    const signature = generateSignature(
        method,
        nowStr,
        host,
        path,
        apisecret,
        uri.search?query:null
    );

    const headers = {
            'ApiKey': apikey,
            'ApiSign': signature,
            'ApiTimestamp': nowStr,
    };
    
    return headers;
}



module.exports = {
    generateSignature,
    microsTimestampStr,
    get_ws_options,
    get_http_headers
  };