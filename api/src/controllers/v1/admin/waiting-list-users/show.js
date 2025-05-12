"use strict";

const validate = require("@root/src/middlewares/validator");
const { WaitingListUser } = require("@src/models");
const { auth, adminAuth } = require("@src/middlewares");
const bodyParser = require("body-parser");
const { Types: { ObjectId } } = require("mongoose"); // Import ObjectId from mongoose


// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    adminAuth(),
    bodyParser.json(),
    async function showWaitingListUsersAdminV1Controller(req, res) {
        const {
            params: { waiting_list_users_id },
        } = req;

        if (!ObjectId.isValid(waiting_list_users_id)) {
            return res.status(400).json({ error: 'Invalid ObjectID' });
        }

        const waitingListUsers = await WaitingListUser.findById(waiting_list_users_id)
        if (!waitingListUsers) res.status(404).send({ msg: 'No early registration found with this ID' })
        res.json({
            waitingListUsers,
        });

    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
