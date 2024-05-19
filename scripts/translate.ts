import { env } from "node:process";
import OpenAI from "openai";
import { prompt } from "./prompt";
import * as fs from "node:fs";
import { readFile } from "./utils";
import { A, D, pipe } from "@mobily/ts-belt";
import chalk from "chalk";
import { setTimeout } from "node:timers/promises";

export const translate = async (content: string): Promise<string> => {
  const openai = new OpenAI({
    apiKey: env["OPENAI_API_KEY"],
  });
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt`${content}`,
      },
    ],
    model: "gpt-4o-2024-05-13",
    stream: false,
  });
  return response.choices[0]?.message.content ?? "";
};

export const getTranslatedMap = async (
  cachedMapFilePath: string,
  lines: Set<string>,
) => {
  const cachedFile = fs.existsSync(cachedMapFilePath)
    ? JSON.parse(readFile(cachedMapFilePath))
    : {};

  const translated = pipe(
    [...lines],
    A.map(async (line) => {
      if (Object.hasOwn(cachedFile, line)) {
        console.log(chalk.cyan("CACHED:"), chalk.white(line.slice(0, 20)));
        return [line, cachedFile[line]];
      }
      let retryCount = 0;
      const run = async (): Promise<string> => {
        let res = "";
        try {
          res = await translate(line);
        } catch (e: unknown) {
          if (
            (e as { message: string }).message.includes("Rate limit reached")
          ) {
            retryCount++;
            console.log(
              chalk.redBright("ERR:"),
              chalk.yellow("RATE_LIMIT:"),
              chalk.cyan("while translating"),
              chalk.white(line.slice(0, 20)),
              chalk.green(`retry:${retryCount}`),
            );
            await setTimeout(60000);
            return await run();
          }
          console.log(
            chalk.redBright("ERR:"),
            chalk.red("UNKNOWN:"),
            chalk.cyan("while translating"),
            chalk.white(line.slice(0, 20), e),
          );
          return "";
        } finally {
          console.log(
            chalk.greenBright("DONE:"),
            chalk.gray(line.slice(0, 20).padEnd(20)),
            "\t→\t",
            chalk.white(res.slice(0, 20)),
          );
        }
        return res;
      };
      const postProcess = (res: string) =>
        res.replaceAll("내용:", "").replaceAll("\n", "");
      return [line, postProcess(await run())] as const;
    }),
  );
  return D.fromPairs(
    (await Promise.allSettled(translated))
      .filter((x) => x.status === "fulfilled")
      //no idea why error occurs
      .map<readonly [string, string]>((x) => x.value),
  );
};
