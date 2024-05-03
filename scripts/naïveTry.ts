import fs from "node:fs";
import { argv, env } from "node:process";
import OpenAI from "openai";

export const fileContent = fs.readFileSync(argv[2] ?? "", "utf8");

const openai = new OpenAI({
  apiKey: env["OPENAI_API_KEY"],
});

async function main() {
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `다음은 카테고리 이론에 관한 책의 tex 파일이야. 원래의 의미와 내용을 존중하고, tex 형식을 유지하되, 영어로 작성된 본문의 내용만을 한국어로 번역해 줘.\n${fileContent}`,
      },
    ],
    model: "gpt-4",
  });

  fs.writeFileSync(argv[3] ?? "", response.choices[0]?.message.content ?? "");
  console.log("done");
  // console.log(response.choices[0].message.content);
}

await main();
