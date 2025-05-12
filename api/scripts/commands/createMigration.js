"use strict";

const { Command } = require("commander");
const { writeFile } = require("fs");
const { snakeCase } = require("lodash");
const moment = require("moment");
const ora = require("ora");
const path = require("path");
const { MIGRATION_DIRECTORY } = require("..");

// ------------------------- Command ---------------------------

function action(name) {
  const spinner = ora("Creating migration file").start();

  name = snakeCase(name);

  const filename = `${ moment.utc().format("YYYY_MM_DD_HHmmss") }_${ name }.js`;

  writeFile(
    path.resolve(MIGRATION_DIRECTORY, filename),
    `"use strict";

const { COLLECTION: NAME } = require("@src/constants");
const { connection: { db } } = require("mongoose");

// ------------------------- COLLECTION -------------------------

const COLLECTION_NAME = NAME.USER; // TODO: change the collection name

const COLLECTION = db.collection(COLLECTION_NAME);

// ------------------------- Commands ---------------------------

/**
 *
 * @param {import("@src/utils/DBTransaction").DBTransaction} DBT
 * @returns {Promise<void>}
 */
exports.up = async function up(DBT) {
  await db.createCollection(COLLECTION_NAME, DBT.mongoose());
};

exports.down = async function down() {
  const collections = await db.listCollections().toArray();

  if (collections.findIndex(collection => collection.name === COLLECTION_NAME) === -1) return;

  await COLLECTION.drop();
};
`,
    (error) => {
      if (error == null) return spinner.succeed(`Created ${ filename }`);

      spinner.fail(`Failed to create ${ filename }`);

      console.error(error);
    },
  );
}

// ------------------------- Commander -------------------------

const program = new Command("migration:create");

program
  .arguments("<name>")
  .description("Create new database migration")
  .action(action);

program.parse(process.argv);
