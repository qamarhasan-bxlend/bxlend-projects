const otp = require('otp-generator')

function otpGenerator() {
    const OTP = otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
    return OTP;
}

module.exports ={
    otpGenerator
}