import { pipe } from "@mobily/ts-belt";

function filterPrefix(text: string): string {
  return text.replace(
    /\\documentclass\[DaoFP\]{subfiles}\n\\begin{document}\n\\setcounter{chapter}{\d}/,
    "",
  );
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

export function extract(fileContent: string): string {
  return pipe(
      fileContent,
      filterPrefix,
      removeBeginEnd,
      // filterTexTag,
      filterMultilineTex,
      removeEmptyLines,
  );
}