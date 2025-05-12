"use strict";

const { Command } = require("commander");

// ------------------------- Commander -------------------------

const program = new Command();

program
  .command(
    "migrate",
    "Migrate database",
    { executableFile: "commands/migrate" },
  )
  .command(
    "migration:create",
    "Create new database migration",
    { executableFile: "commands/createMigration" },
  )
  .command(
    "migrate:rollback",
    "Rollback the database migrations",
    { executableFile: "commands/rollbackMigrations" },
  )
  .command(
    "migrate:refresh",
    "Rollback and run the database migrations again",
    { executableFile: "commands/refreshMigrations" },
  )
  .command(
    "seed",
    "Seed the database with fake data",
    { executableFile: "commands/seed" },
  )
  .command(
    "seeder:create",
    "Create new database seeder",
    { executableFile: "commands/createSeeder" },
  );

program.parse(process.argv);
