#!/usr/bin/env node

import Listr from "listr";
import chalk from "chalk";
import childProcess from "child_process";
import clear from "clear";
import cliSpinner from "cli-spinner";
import figlet from "figlet";
import fs from "fs";
import inquirer from "inquirer";
import process from "process";
import util from "util";

const exec = util.promisify(childProcess.exec);

const packages = {
  remove: [
    "@testing-library/jest-dom",
    "@testing-library/react",
    "@testing-library/user-event",
    "@types/jest",
  ],
  install: ["react-router-dom", "@types/react-router-dom"],
  installDev: [
    "@testing-library/jest-dom",
    "@testing-library/react",
    "@testing-library/user-event",
    "@types/jest",
    "eslint-config-prettier",
  ],
};

clear();

console.log(
  chalk.yellow(
    figlet.textSync("C2 React Base generator", { horizontalLayout: "full" })
  )
);

const execOption = { stdio: "inherit" };

const ask = () => {
  const questions = [
    {
      type: "input",
      name: "name",
      message: "Enter a name for the project:",
      default: "c2-react",
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return "Please enter a name for the project.";
        }
      },
    },
    {
      type: "list",
      name: "stateManagement",
      message: "State management",
      choices: ["Redux Saga", "Redux Thunk", "Zustand", "None"],
      default: "none",
    },
    {
      type: "list",
      name: "language",
      message: "Use multiple language?",
      choices: ["yes", "no"],
      default: "no",
    },
    {
      type: "list",
      name: "theme",
      message: "Use theme (with styled-component)?",
      choices: ["yes", "no"],
      default: "no",
    },
  ];
  return inquirer.prompt(questions);
};

// MAIN
const project = await ask();

console.log(
  `\nGenerate project with core module: ${chalk.red(
    "CRA with Typescript"
  )}, ${chalk.green("React-Router v6")}, ${chalk.yellow(
    "ESLint"
  )}, ${chalk.blue("Prettier")}, ${chalk.magenta("Husky")}, ${chalk.cyan(
    "SonarQube"
  )}, ${chalk.redBright("Husky")}, ${chalk.greenBright(
    "React Testing library"
  )}, ${chalk.yellowBright("Storybook")} and ${chalk.blueBright(
    "Gitlab CI/CD intergation"
  )}.\n`
);

const currentDirectory = `${process.cwd()}/generator`;
const workDirectory = `${process.cwd()}/${project.name}`;

const tasks = new Listr([
  {
    title: "Install CRA with typescript",
    task: async () => {
      try {
        return await exec(
          `yarn create react-app ${project.name} --template typescript`
        );
      } catch (error) {
        throw new Error(
          "Folder exist. Please select a different name for the project"
        );
      }
    },
  },
  {
    title: "Flush packages",
    task: async (_, task) => {
      try {
        if (fs.existsSync(`${project.name}/package-lock.json`)) {
          await exec(`rm package-lock.json`, {
            cwd: workDirectory,
          });
        }
        return await exec(`rm -rf node_modules`, { cwd: workDirectory });
      } catch (error) {
        task.skip("Project cleaned");
      }
    },
  },
  {
    title: `Install ${chalk.yellow("ESLint")}, ${chalk.magenta(
      "Husky"
    )} and ${chalk.blue("Prettier")}`,
    task: async () => {
      try {
        await exec(`yarn add --dev prettier pretty-quick eslint`, {
          cwd: workDirectory,
        });
        await exec(`npx husky-init && yarn`, { cwd: workDirectory });
        return await exec(
          `yarn husky set .husky/pre-commit "npx pretty-quick --staged"`,
          {
            cwd: workDirectory,
          }
        );
      } catch (error) {
        throw new Error("Install package failed!");
      }
    },
  },
  {
    title: "Modify packages",
    task: async (_, task) => {
      try {
        await exec(`yarn remove ${packages.remove.join(" ")}`, {
          cwd: workDirectory,
        });
        await exec(`yarn add ${packages.install.join(" ")}`, {
          cwd: workDirectory,
        });
        await exec(`yarn add --dev ${packages.installDev.join(" ")}`, {
          cwd: workDirectory,
        });
        return await exec(`yarn`, { cwd: workDirectory });
      } catch (error) {
        task.skip("Project cleaned");
      }
    },
  },
]);

await tasks.run();

console.log("\n%s Project ready", chalk.green.bold("DONE"));
