import { pipe } from "@mobily/ts-belt";

function filterPrefix(text: string): string {
  return text
    .replace(/\\documentclass\[DaoFP\]{subfiles}/, "")
    .replace(/\\begin{document}/, "")
    .replace(/\\setcounter{chapter}{\d}/, "");
}

function filterMultilineTex(text: string): string {
  return text.replace(/\\\[(.|\n)*?\\\]/g, "");
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

function removeClosingBracket(text: string): string {
  return text.replace(/\\[\[\]]|/g, "");
}

function removeSingleTexLine(text: string): string {
  return text.replace(/^\s*\\[\[\]\w{} ]*$/gm, "");
}

export function extract(fileContent: string): string {
  return pipe(
    fileContent,
    filterPrefix,
    removeBeginEnd,
    removeClosingBracket,
    removeSingleTexLine,
    filterMultilineTex,
    removeEmptyLines,
  );
}
