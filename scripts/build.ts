import { execSync } from "node:child_process";
import { getChapter } from "./utils";
import { argv } from "node:process";

export const build = (chapterNumber: string) => {
  const execute = () => {
    const command = `pdflatex -shell-escape ./kr/${getChapter(
      chapterNumber,
    )} -output-directory=./kr`;
    console.log(command);
    execSync(command);
  };
  const cleanUp = () => {
    const command =
      "rm -rf ./*.aux ./*.log ./*.out ./*.idx ./*.pyg && mv ./*.pdf ./kr/pdf";
    console.log(command);
    execSync(command);
  };

  execute();
  cleanUp();
};

build(argv[2] ?? "");
