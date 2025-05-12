"use strict"

require("module-alias/register");
const { seedCountries } = require('./functions/countries');
const { seedCurrencies } = require('./functions/currencies');
const { seedCurrencyPairs } = require('./functions/currency-pairs');
const { seedTokenSetup } = require('./functions/presaleTokens');
require('@src/database')

const args = process.argv.slice(2);

const validEnvironments = ['development', 'testing', 'staging'];

const environmentFlag = args.find(arg => validEnvironments.includes(arg));

const runSeedFunctions = async () => {
    if (!environmentFlag) {
        console.log('Invalid command. Please specify a valid environment flag (--development, --testing, --staging).');
    } else {
        switch (environmentFlag) {
            case 'development':
                // await seedCountries();
                // await seedCurrencies();
                // await seedCurrencyPairs();
                // await seedTokenSetup()
                break;
            case 'testing':
                // Call testing seed functions
                break;
            case 'staging':
                // Call staging seed functions
                break;
            default:
                console.log('Invalid environment.');
                break;
        }
        process.exit('1')
    }
};
runSeedFunctions();
