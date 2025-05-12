"use strict";

/* istanbul ignore file */

const { 
  BitgoError,
  BitgoTimeoutError,
  BitgoNotfoundError,
  BitgoCoinUnsupportedError,
  BitgoInvalidWalletIdError,
  BitgoSchemaValidationError,
  BitgoForbiddenCountry,
} = require("@src/errors");

const bitgoErrorDict = {

  403:BitgoForbiddenCountry,
  404:{
    NotFound:BitgoNotfoundError,
  },
  400:{
    CoinUnsupported:BitgoCoinUnsupportedError,
    InvalidWalletId:BitgoInvalidWalletIdError,
    SchemaValidationError:BitgoSchemaValidationError,
    Invalid:BitgoSchemaValidationError,
  },

};

function createBitgoError(status, data) {

  try{

    let error;
    console.log(data)

    if( typeof data == "string")
      error = bitgoErrorDict[status];
    else
      error = bitgoErrorDict[status][data.name];

    if(error) return new error(data.message);
    return new BitgoError(data.message);
  
  }catch(err){

    return new BitgoError(err.message);

  }
  
}
function cryptoApisError(data){
  console.log(data.error)
  return data
}

async function responseHandler(request) {

  try {
    const result = await request;
    return result.data;

  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      
      throw cryptoApisError(data)
      
    } else if (error.request) {

      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new BitgoTimeoutError(error);

    } else {
      // Something happened in setting up the request that triggered an Error
      throw new BitgoError(error);

    }

  }

}

module.exports = responseHandler;
