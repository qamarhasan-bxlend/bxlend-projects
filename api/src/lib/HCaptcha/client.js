"use strict";

/* istanbul ignore file */

const Axios = require("axios");
const { HCAPTCHA_SECRET_KEY, HCAPTCHA_SITE_VERIFY_URL } = require("@src/config");
const responseHandler = require('./responseHandler');
const qs = require("querystring"); // Needed for form-urlencoded data

const axios = Axios.create({
    baseURL: HCAPTCHA_SITE_VERIFY_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

async function verifyHCaptcha(response, remoteIp) {
    try {
        const data = qs.stringify({
            secret: HCAPTCHA_SECRET_KEY,
            response: response,
            remoteip: remoteIp || undefined, // Optional field
        });

        const res = await axios.post("/", data);
        return res
    } catch (error) {
        console.error("hCaptcha Verification Error:", error);
        return responseHandler({ success: false, error: error.message });
    }
}

module.exports = { verifyHCaptcha };
