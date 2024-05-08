import * as fs from 'node:fs';
export function getChapter(chapter: string): string {
    const fileList = fs
    .readdirSync("./content")
    .filter((f) => f.startsWith(`${chapter}-`));

    return fileList[0] ?? "";
}

export const readFile = (path: string): string => fs.readFileSync(path, "utf8");
export const writeFile = (path: string) => (content:string):void => fs.writeFileSync(path,content);