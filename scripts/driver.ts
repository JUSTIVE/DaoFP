import { argv } from "bun";
import { getChapter, readFile, writeFile } from "./utils";
import { extract } from "./extract";
import { A, D, F, pipe, S } from "@mobily/ts-belt";
import { translate } from "./translate";
import { setTimeout } from "node:timers/promises";
import chalk from "chalk";
import * as fs from "node:fs";
import { build } from "./build";
import { execSync } from "node:child_process";
import path from "node:path";

const fileOfChapter = getChapter(argv[2] ?? "");
console.log(fileOfChapter);
const inPath = `./content/${fileOfChapter}`;
const outPath = `./kr/${fileOfChapter}`;
const cachedMapFile = `./kr/${fileOfChapter}.json`;

const file = readFile(inPath);
const inFileContentLines = new Set(
  pipe(file, extract, S.split("\n"), A.map(S.trim), A.filter(S.isNotEmpty)),
);
const tupledLines = pipe(
  [...inFileContentLines],
  A.map((line) => [line, line] as const),
);

const getTranslatedMap = async () => {
  const cachedFile = fs.existsSync(cachedMapFile)
    ? JSON.parse(readFile(cachedMapFile))
    : {};
  return async () => {
    const translated = pipe(
      tupledLines,
      A.map(async ([k, v]) => {
        if (Object.hasOwn(cachedFile, k)) {
          console.log(chalk.cyan("CACHED:"), chalk.white(k.slice(0, 20)));
          return [k, cachedFile[k]];
        }
        let retryCount = 0;
        const run = async (): Promise<string> => {
          try {
            return await translate(v);
          } catch (e: unknown) {
            if (
              (e as { message: string }).message.includes("Rate limit reached")
            ) {
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
            console.log(
              chalk.greenBright("DONE:"),
              chalk.white(k.slice(0, 20)),
            );
          }
        };
        return [k, await run()] as const;
      }),
    );
    return D.fromPairs(
      (await Promise.allSettled(translated))
        .filter((x) => x.status === "fulfilled")
        .map((x: PromiseFulfilledResult<readonly [string, string]>) => x.value),
    );
  };
};

const translatedMap = await (await getTranslatedMap())();

writeFile(cachedMapFile)(JSON.stringify(translatedMap));

pipe(
  file,
  S.split("\n"),
  A.map((x) =>
    Object.hasOwn(translatedMap, S.trim(x)) && S.trim(x).length > 0
      ? translatedMap[
          S.trim(x) as unknown as keyof typeof translatedMap
        ]?.replaceAll("\\n", "") ?? x
      : x,
  ),
  A.insertAt(1, "\\usepackage{kotex}"),
  A.join("\n"),
  F.tap(writeFile(outPath)),
);

console.log(chalk.bgMagenta.white("TRANSLATION DONE"));
build(argv[2] ?? "");
console.log(chalk.bgMagenta.white("PDF GENERATION DONE"));
execSync(`open ./kr/pdf/${path.basename(fileOfChapter, ".tex")}.pdf`);
