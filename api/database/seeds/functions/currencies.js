const { Currency } = require('@src/models'); 
const currencyData = require('../../../../../currencies.json');
require('@src/database')
async function seedCurrencies() {
    try {

        for (const currency of currencyData) {
            await Currency.findOneAndUpdate({ code: currency.code }, currency, { upsert: true });
        }
        console.log('currencies seeded successfully');
    } catch (error) {
        console.error('Error seeding currencies:', error);
        process.exit(1);
    }
}
module.exports = {
    seedCurrencies
}