"use strict";

/* istanbul ignore file */

async function responseHandler(request) {

  try {
    const result = await request;
    return result.data;

  } catch (error) {
    console.log(error)
    return error;
}
}

module.exports = responseHandler;
