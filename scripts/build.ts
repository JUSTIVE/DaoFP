import { execSync } from "node:child_process";
import { getChapter } from "./utils";
import { argv } from "node:process";
import chalk from "chalk";

export const build = (chapterNumber: string) => {
  const execute = () => {
    const command = `pdflatex -shell-escape ./kr/${getChapter(
      chapterNumber,
    )} -output-directory=./kr`;
    console.log(chalk.cyan("BUILD:"), chalk.white(command));
    execSync(command);
  };
  const cleanUp = () => {
    const command =
      "rm -rf ./*.aux ./*.log ./*.out ./*.idx ./*.pyg && mv ./*.pdf ./kr/pdf";
    console.log(chalk.cyan("CLEAN UP:"), chalk.white(command));
    execSync(command);
  };

  execute();
  cleanUp();
};

build(argv[2] ?? "");
