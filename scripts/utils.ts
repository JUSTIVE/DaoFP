import * as fs from 'node:fs';
export function getChapter(chapter: string): string {
    const fileList = fs
    .readdirSync("./content")
    .filter((f) => f.startsWith(`${chapter}-`));

    return fileList[0] ?? "";
}

function _pipe(): unknown {
let e = arguments[0];
for (let t = 1, p = arguments.length; t < p; t++) {
    e = arguments[t](e);
}
return e;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const pipe: any = _pipe;