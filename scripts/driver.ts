import { argv } from "bun";
import { getChapter, readFile, writeFile } from "./utils";
import { extract } from "./extract";
import { A, pipe, S } from "@mobily/ts-belt";
import { translate } from "./translate";


const fileOfChapter = getChapter(argv[2] ?? "");
console.log(fileOfChapter)
const inPath = `./content/${fileOfChapter}`;
const outPath = `./kr/${fileOfChapter}`

const file = readFile(inPath);
const kv = pipe(
    file,
    extract,
    S.split('\n'),
    A.map(line=>[line,line] as const),
)

const translated = await Promise.allSettled(kv.map(async([k,v])=>[k,await translate(v)] as const))
if(A.every(translated,x=>x.status==='fulfilled')){
    const kv = Object.fromEntries(translated.map(x=>x.value))
    pipe(
        file,
        S.split('\n'),
        A.map(x=>{
            Object.hasOwn(kv,x) ? kv[x] : x
        }),
        A.join('\n'),
        writeFile(outPath)
    )
}
else{
    console.log(translated.filter(x=>x.status==='rejected').map(x=>x))
}