"use strict"

const { User, ResetPassword } = require('@src/models')
const bcrypt = require("bcrypt");
const { otpGenerator } = require('./opt-generator')
const { Mailgun } = require('@src/lib')

//---------------------------------------SERVICE----------------------------------------------------------------

async function requestResetPasswordOTP(email) {
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error('User Does not Exist')
        }

        let OTP = await ResetPassword.findOne({ userId: user._id })
        if (OTP) {
            await OTP.deleteOne()
        }

        OTP = otpGenerator();
        const hash = await bcrypt.hash(OTP, 10)

        const userOTP = await ResetPassword.create({
            userId: user._id,
            otp: hash,
            created_at: Date.now()
        })
        await userOTP.save()
        if (!userOTP) {
            throw new Error('OTP creation Failed')
        }

        //Send OTP to User's email
        const res = Mailgun.sendPasswordResetOTP(user, OTP)
        if (!res) {
            throw new Error('Could not email OTP')
        }

        return user
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error handling
            throw new Error('Duplicate key error. User may have already requested a password reset.')
        } else {
            console.log(error)
            throw new Error(error.message)
        }
    }
}

// -----------------------------------------EXPORTS--------------------------------------------

module.exports = requestResetPasswordOTP


