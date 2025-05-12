const { Country } = require('@src/models'); 
const countryData = require('../../../../../countries.json');
require('@src/database')
async function seedCountries() {
    try {

        for (const country of countryData) {
            await Country.findOneAndUpdate({ name: country.name }, country, { upsert: true });
        }
        console.log('Countries seeded successfully');
    } catch (error) {
        console.error('Error seeding countries:', error);
        process.exit(1);
    }
}
module.exports = {
    seedCountries
}