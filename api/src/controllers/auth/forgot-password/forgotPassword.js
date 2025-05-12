
const { User, ResetPassword } = require('@src/models')
const bcrypt = require("bcrypt");
const { Joi } = require("@src/lib");
const { validate } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { Mailgun } = require('@src/lib')


//------------------------------------------Controller----------------------------------------
const CONTROLLER = [
    bodyParser.json(),
    validate({
        body: Joi
            .object()
            .keys({
                otp: Joi
                    .string()
                    .required(),
                password: Joi
                    .string()
                    .required(),
            })
            .required(),
    }),
    async function forgotPassword(req, res) {
        const { otp, password } = req.body
        const { email } = req.params

        try {
            let user = await User.findOne({ email })

            if (!user)
                throw new Error('User Does not Exist')

            let resetPasswordOtp = await ResetPassword.findOne({ userId : user._id })
            if (!resetPasswordOtp) {
                throw new Error('Invalid or Expired OTP.')
            }
            const isValid = await bcrypt.compare(otp, resetPasswordOtp.otp)
            if (!isValid) {
                throw new Error('Invalid or Expired OTP.')
            }
            const newPassword = await bcrypt.hash(password, 10)

            await User.updateOne(
                { _id: user._id },
                { $set: { password: newPassword } },
                { new: true }
            )
            await resetPasswordOtp.deleteOne()
            console.log(`user password updated`)

            // Send Password Reset Confirmation Mail
            await Mailgun.sendPasswordResetConfirmation(user)
            
            res.json({
                msg: 'password reset successfully'
            })
        }
        catch (error) {
            if (error.code === 11000) {
                // Duplicate key error handling
                return res.status(400).json({
                    error: 'Duplicate key error. User may have already requested a password reset.'
                });
            } else {
                // Other errors
                console.log(error)
                return res.status(500).json({
                    error: error.message
                });
            }
        }
    }]

// -----------------------------------------Exports-----------------------------------------

module.exports = CONTROLLER