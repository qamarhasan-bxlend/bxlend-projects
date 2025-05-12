const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = require('@src/config')
const client = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

async function sendPhoneVerificationOtp(phone, otp = '12345') {
    try {
        const message = await client.messages.create({
            from: TWILIO_PHONE,
            to: phone,
            body: `Your Bxlend phone verification OTP code is ${otp}`,
        });
        console.log(
            "Otp sms has been sent successfully on your Phone:",
            message.sid
        );
        console.log('twilio resp: ', message)
        return {
            status : true,
            response : message
        };
    } catch (err) {
        console.log("An error occured during message sending");
        return {
            status : false,
            response : err
        };
    }
}

module.exports = { sendPhoneVerificationOtp }