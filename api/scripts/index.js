"use strict";

const path = require("path");
const Migration = require("./MigrationModel");

/**
 *
 * @param {string} filename
 * @returns {string}
 */
function filenameToMigrationName(filename) {
  return filename.replace(/\.js$/, "");
}

const DATABASE_SCRIPTS_DIRECTORY = path.resolve(__dirname, "..", "database");

const MIGRATION_DIRECTORY = path.resolve(DATABASE_SCRIPTS_DIRECTORY, "migrations");

const SEED_DIRECTORY = path.resolve(DATABASE_SCRIPTS_DIRECTORY, "seeds");

module.exports = {
  Migration,
  filenameToMigrationName,
  DATABASE_SCRIPTS_DIRECTORY,
  MIGRATION_DIRECTORY,
  SEED_DIRECTORY,
};
