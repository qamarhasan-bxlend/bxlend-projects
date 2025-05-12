const { Forbidden } = require("@src/errors");
const { Joi } = require("@src/lib");
const { User } = require('@src/models')
const { auth } = require("@src/middlewares");
const bodyParser = require("body-parser");

// ------------------------- Controller -------------------------

const CONTROLLER = [
    auth(),
    bodyParser.json(),
    async function addTofavourites(req, res) {
        const { user, params: { currency_pair } } = req;

        if (!currency_pair) {
            return res.status(400).json({ error: "Currency pair not provided" });
        }

        try {
            let updatedUser;
            const { _id } = currency_pair

            if (user.favorite_currencyPairs.includes(_id)) {
                updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $pull: { favorite_currencyPairs: _id } },
                    { new: true }
                );
                if (!updatedUser) {
                    throw new Error("User not found");
                }
                res.status(200).send('removed from favorites')
            } else {
                updatedUser = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $push: { favorite_currencyPairs: currency_pair } },
                    { new: true }
                );
                if (!updatedUser) {
                    throw new Error("User not found");
                }
                res.status(200).send('added to favorites')
            }

        } catch (error) {
            console.error("Error adding to favorites:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    },
];

// ------------------------- Exports ----------------------------

module.exports = CONTROLLER;
