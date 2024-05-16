import { argv } from "bun";
import { getChapter, readFile, writeFile } from "./utils";
import { extract } from "./extract";
import { A, pipe, S } from "@mobily/ts-belt";
import { translate } from "./translate";
import { setTimeout } from "node:timers/promises";

import chalk from "chalk";

const fileOfChapter = getChapter(argv[2] ?? "");
console.log(fileOfChapter);
const inPath = `./content/${fileOfChapter}`;
const outPath = `./kr/${fileOfChapter}`;

const file = readFile(inPath);
const tupledLines = pipe(
  file,
  extract,
  S.split("\n"),
  A.map((line) => [line, line] as const),
);

const translated = pipe(
  tupledLines,
  A.map(async ([k, v]) => {
    let retryCount = 0;
    const run = async (): Promise<string> => {
      try {
        return await translate(v);
      } catch (e: unknown) {
        if ((e as { message: string }).message.includes("Rate limit reached")) {
          retryCount++;
          console.log(
            chalk.redBright("ERR:"),
            chalk.yellow("RATE_LIMIT:"),
            chalk.cyan("while translating"),
            chalk.white(k.slice(0, 20)),
            chalk.green(`retry:${retryCount}`),
          );
          await setTimeout(60000);
          return await run();
        }
        console.log(
          chalk.redBright("ERR:"),
          chalk.red("UNKNOWN:"),
          chalk.cyan("while translating"),
          chalk.white(k.slice(0, 20), e),
        );
        return "";
      } finally {
        console.log(chalk.greenBright("DONE:"), chalk.white(k.slice(0, 20)));
      }
    };
    return [k, await run()] as const;
  }),
);

pipe(
  file,
  S.split("\n"),
  A.map((x) => {
    Object.hasOwn(translated, x)
      ? translated[x as unknown as keyof typeof translated]
      : x;
  }),
  A.join("\n"),
  writeFile(outPath),
);
