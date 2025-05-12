"use strict";

require("module-alias/register");
require("@src/database");

const { DBTransaction } = require("@src/utils");
const { Command } = require("commander");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const ora = require("ora");
const path = require("path");
const { Migration, filenameToMigrationName, MIGRATION_DIRECTORY } = require("..");

// ------------------------- Command ---------------------------

async function action() {
  const readSpinner = ora("Reading migration files").start();

  let filenames = [];
  let migrationNames = [];
  let batch = 0;

  try {
    filenames = readdirSync(MIGRATION_DIRECTORY);
    migrationNames = filenames.map(filenameToMigrationName);
    batch = 0;

    readSpinner.start("Checking migration files with database");

    try {
      const migrations = await Migration.find().sort("-created_at");

      if (migrations.length > 0) {
        batch = migrations[0].batch + 1;

        migrationNames = migrationNames.filter(
          (name) => migrations.findIndex(
            (migration) => migration.name === name,
          ) === -1,
        );
      }
    } catch (error) {
      readSpinner.fail("Failed to check migration files with database");

      console.error(error);

      return await mongoose.disconnect();
    }
  } catch (error) {
    readSpinner.fail("Failed to read migration files");

    console.error(error);

    return await mongoose.disconnect();
  }

  if (migrationNames.length === 0) {
    readSpinner.info("Nothing to get migrated");

    return await mongoose.disconnect();
  }

  readSpinner.succeed("Read migration files successfully");

  for (const migrationName of migrationNames) {

    const spinner = ora(`Migrating ${ migrationName }`).start();

    const DBT = await DBTransaction.init({ defaultTransactionOptions: { writeConcern: undefined } });

    try {
      const { up } = require(path.resolve(MIGRATION_DIRECTORY, migrationName));

      await up(DBT);

      await Migration.create(
        [{
          name: migrationName,
          batch,
        }],
        DBT.mongoose(),
      );

      await DBT.commit();
    } catch (error) {
      await DBT.abort();

      spinner.fail(`Failed to migrate ${ migrationName }`);

      console.error(error);

      return await mongoose.disconnect();
    }

    spinner.succeed(`Migrated ${ migrationName }`);
  }

  await mongoose.disconnect();
}

// ------------------------- Commander -------------------------

const program = new Command("migrate");

program
  .description("Migrate database")
  .action(action);

program.parse(process.argv);
