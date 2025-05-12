const { CurrencyPair } = require('@src/models'); 
const currencyPairs = require('../../../../../currency_pairs.json');

async function seedCurrencyPairs() {
    try {
        for (const currency_pair of currencyPairs) {
            console.log(currency_pair.currency_codes);
            await CurrencyPair.findOneAndUpdate(
                { symbol: currency_pair.symbol },
                {
                    currency_codes: [currency_pair.currency_codes[0],currency_pair.currency_codes[1]], // Accessing the correct property
                    symbol: currency_pair.symbol,
                    price: currency_pair.price,
                },
                { upsert: true }
            );
        }
        console.log('currency Pairs seeded successfully');
    } catch (error) {
        console.error('Error seeding currency Pairs:', error);
        process.exit(1);
    }
}

module.exports = {
    seedCurrencyPairs
}