#!/usr/bin/env node

import { exec, execSync } from "child_process";

import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import fs from "fs";
import inquirer from "inquirer";
import process from "process";

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

const main = async () => {
  const project = await ask();

  // Install CRA with typescript
  //   execSync(
  //     `npx create-react-app ${project.name} --template typescript`,
  //     execOption
  //   );

  const workDirectory = `${process.cwd()}/${project.name}`;
  // Clear node_modules
  execSync(`rm -rf node_modules`, { cwd: workDirectory });

  // Re-install packge
};

main();
