const { PresaleTokenSetup } = require('@src/models');
const tokenSetup = require('../../../../tokenSetup.json');
require('@src/database')
async function seedTokenSetup() {
    try {

        const newTokenSetup = await PresaleTokenSetup.create({
            ...tokenSetup
        });
        console.log("🚀 ~ seedTokenSetup ~ newTokenSetup:", newTokenSetup)
    } catch (error) {
        console.error('Error seeding PresaleTokens:', error);
        process.exit(1);
    }
}
module.exports = {
    seedTokenSetup
}