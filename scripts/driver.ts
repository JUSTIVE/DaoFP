import { argv } from "bun";
import { getChapter, readFile, writeFile } from "./utils";
import { extract } from "./extract";
import { A, F, pipe, S } from "@mobily/ts-belt";
import { getTranslatedMap } from "./translate";
import chalk from "chalk";
import { build } from "./build";
import { execSync } from "node:child_process";
import path from "node:path";

//번역 입력 파일 이름
const fileOfChapter = getChapter(argv[2] ?? "");
//번역 입력 파일 경로
const inPath = `./content/${fileOfChapter}`;
//번역 결과 파일 경로
const outPath = `./kr/${fileOfChapter}`;
//번역 캐시 맵 파일 경로
const cachedMapFile = `./kr/${fileOfChapter}.json`;
//번역 입력 파일 내용
const file = readFile(inPath);
const uniqueLines = new Set(
  pipe(file, extract, S.split("\n"), A.map(S.trim), A.filter(S.isNotEmpty)),
);

//번역 수행
const translatedMap = await getTranslatedMap(cachedMapFile, uniqueLines);

//번역 캐시 맵 업데이트
pipe(translatedMap, JSON.stringify, F.tap(writeFile(cachedMapFile)));

//번역 파일에 번역 맵으로 치환
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
  A.insertAt(1, "\\usepackage{kotex}"), //한글 패키지 추가
  A.join("\n"),
  F.tap(writeFile(outPath)),
);

console.log(chalk.bgMagenta.white("TRANSLATION DONE"));
//빌드 수행
build(argv[2] ?? "");
console.log(chalk.bgMagenta.white("PDF GENERATION DONE"));
//다 되면 파일을 엽니다.
execSync(`open ./kr/pdf/${path.basename(fileOfChapter, ".tex")}.pdf`);
