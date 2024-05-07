import * as fs from "node:fs";
import { argv } from "node:process";
import { getChapter, pipe } from "./utils";

function readFile(path: string): string {
  return fs.readFileSync(path, "utf8");
}

function filterPrefix(text: string): string {
  return text.replace(
    /\\documentclass\[DaoFP\]{subfiles}\n\\begin{document}\n\\setcounter{chapter}{\d}/,
    "",
  );
}

function filterTexTag(text: string): string {
  return text
    .split("\n")
    .filter((line) => !/^\\\w+/.test(line))
    .join("\n");
}

function filterMultilineTex(text: string): string {
  return text.replace(/\\\[(.|\n)*?\\\]/g, "");
  // .replace(/\\begin\{(.|\n)*?\\end\{(.|\n)*?\}/g, "");
}

function removeEmptyLines(text: string): string {
  return text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

function removeBeginEnd(text: string): string {
  return text.replace(/\\begin\{(.|\n)*?\\end\{(.|\n)*?\}/g, "");
}

function extract(inPath: string, outPath: string): void {
  fs.writeFileSync(
    outPath,
    pipe(
      inPath,
      readFile,
      filterPrefix,
      removeBeginEnd,
      filterTexTag,
      filterMultilineTex,
      removeEmptyLines,
    ),
  );
}

const fileOfChapter = getChapter(argv[2] ?? "");
const inPath = `./content/${fileOfChapter}`;
const extractedPath = `./content/${fileOfChapter
  .split(".")
  .join(".extracted.")}`;

extract(inPath, extractedPath);
