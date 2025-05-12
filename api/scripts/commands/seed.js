"use strict";

require("module-alias/register");
require("@src/database");

const SEEDERS = require("@database/seeds");
const { Command } = require("commander");
const mongoose = require("mongoose");
const ora = require("ora");

// ------------------------- Command ---------------------------

async function action() {
  let name = null;
  let spinner = null;

  if (SEEDERS.length === 0) {
    ora("Nothing to seed").info();

    return await mongoose.disconnect();
  }

  try {
    for (const seeder of SEEDERS) {
      name = seeder.name;

      spinner = ora(`Seeding ${ name }`).start();

      await seeder.run();

      spinner.succeed(`Seeded ${ name }`);

      name = null;
      spinner = null;
    }
  } catch (error) {
    if (name != null) spinner?.fail(`Failed to seed ${ name }`);

    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
}

// ------------------------- Commander -------------------------

const program = new Command("seed");

program
  .description("Seed the database with fake data")
  .action(action);

program.parse(process.argv);
