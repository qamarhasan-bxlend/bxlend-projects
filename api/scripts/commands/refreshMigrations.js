"use strict";

require("module-alias/register");
require("@src/database");

const { DBTransaction } = require("@src/utils");
const { Command } = require("commander");
const { uniq, orderBy } = require("lodash");
const mongoose = require("mongoose");
const ora = require("ora");
const path = require("path");
const { Migration, MIGRATION_DIRECTORY } = require("..");

// ------------------------- Command ---------------------------

async function action(command) {
  let spinner = ora("Reading migrations from database").start();

  const steps = command.steps;
  let migrations;
  let batch;

  try {
    migrations = await Migration.find()
      .select("name batch")
      .sort("-batch name");

    if (migrations.length === 0) {
      spinner.info("Nothing to get refreshed");

      return await mongoose.disconnect();
    }

    const batches = uniq(migrations.map(migration => migration.batch));

    if (steps > batches.length) throw new Error(`Can only refresh ${ batches.length } steps (maximum)`);

    batch = steps === 0 ? -1 : Math.max(...batches) - steps;

    migrations = migrations.filter(migration => migration.batch > batch);
  } catch (error) {
    spinner.fail("Failed to rollback");

    console.error(error);

    return await mongoose.disconnect();
  }

  spinner.succeed("Read migrations from database");

  batch += 1;

  for (const migration of migrations) {
    const { name } = migration;

    spinner = ora(`Rolling back ${ name }`).start();

    try {
      const { down } = require(path.resolve(MIGRATION_DIRECTORY, name));

      await down();

      await migration.delete();

      spinner.succeed(`Rolled back ${ name }`);
    } catch (error) {
      spinner.fail(`Failed to rollback ${ name }`);

      console.error(error);

      return await mongoose.disconnect();
    }
  }

  migrations = orderBy(migrations, ["name"], ["asc"]);

  for (const migration of migrations) {
    const { name } = migration;

    spinner = ora(`Migrating ${ name }`).start();

    const DBT = await DBTransaction.init({ defaultTransactionOptions: { writeConcern: undefined } });

    try {
      const { up } = require(path.resolve(MIGRATION_DIRECTORY, name));

      await up(DBT);

      await Migration.create(
        [{
          name,
          batch,
        }],
        DBT.mongoose(),
      );

      await DBT.commit();

      spinner.succeed(`Migrated ${ name }`);
    } catch (error) {
      await DBT.abort();

      spinner.fail(`Failed to migrate ${ name }`);

      console.error(error);

      return await mongoose.disconnect();
    }
  }

  await mongoose.disconnect();
}

// ------------------------- Commander -------------------------

const program = new Command("migrate:refresh");

program
  .description("Rollback and run the database migrations again")
  .option("--steps [steps]", "The number of steps it should refresh", (steps) => +steps, 0)
  .action(action);

program.parse(process.argv);
