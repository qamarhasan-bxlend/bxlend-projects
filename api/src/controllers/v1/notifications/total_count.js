const { Notification } = require('@src/models');
const { auth } = require('@src/middlewares');


const CONTROLLER = [
    auth(),
    async function listUserNotificationsCount(req, res) {
        const {user} = req

        const filter = {
            user: user._id,
            readStatus: false,
            deleted_at: {
                $exists: false,
            },
        };

        const total_count = await Notification.countDocuments(filter);

        if(total_count == null || total_count == undefined )
            throw new Error('Could not fetch total notification count')

        res.json({
            total_count,
        })
    }
];

module.exports = CONTROLLER;
