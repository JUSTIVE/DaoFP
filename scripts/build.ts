import { execSync } from "node:child_process";
import { getChapter } from "./utils";
import chalk from "chalk";

//빌드 수행
export const build = (chapterNumber: string) => {
  const execute = () => {
    const command = `pdflatex -shell-escape ./kr/${getChapter(chapterNumber)}`;
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
