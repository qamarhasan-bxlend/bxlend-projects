"use strict"
const { auth } = require('@src/middlewares')
const {Forbidden} = require('@src/errors')

const CONTROLLER = [
    auth(),
    async function UpdateNotificationReadStatus(req, res) {
        const { user, params: { notification: notification } } = req

        if(user._id.toString() !=  notification.user.toString())
            throw new Forbidden()

        if (notification.readStatus)
            res.status(200).send('notification already read')

        else {
            notification.readStatus = true
            await notification.save()
            res.status(200).send('notification read')
        }
    }
]

module.exports = CONTROLLER