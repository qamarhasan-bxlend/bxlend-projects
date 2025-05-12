"use strict";

const { Command } = require("commander");
const { writeFile } = require("fs");
const { snakeCase } = require("lodash");
const ora = require("ora");
const path = require("path");
const { SEED_DIRECTORY } = require("..");

// ------------------------- Command ---------------------------

function action(name) {
  const spinner = ora("Creating seeder file").start();

  name = snakeCase(name);

  if (name === "index") return spinner.fail("Can not create seeder \"index\"");

  const filename = `${ name }.js`;

  writeFile(
    path.resolve(SEED_DIRECTORY, filename),
    `"use strict";

const {} = require("@src/models");

exports.name = "${ name }";

exports.run = async function run() {
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

const program = new Command("seeder:create");

program
  .arguments("<name>")
  .description("Create new database seeder")
  .action(action);

program.parse(process.argv);
