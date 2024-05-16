import fs from "node:fs";
import { env } from "node:process";
// import { env } from "node:process";
import OpenAI from "openai";

/*to run this file, use following command
 * pbpaste > ./in.txt && bun ./scripts/manualTranslation.ts && bat ./out.txt | pbcopy
 */

export const fileContent = fs.readFileSync("./in.txt", "utf8");

export const translate = async (content: string) => {
  const openai = new OpenAI({
    apiKey: env["OPENAI_API_KEY"],
  });
  const response = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `지금부터 전달하는 문장들은 카테고리 이론에 관한 latex 파일들의 일부야. 
        이를 원래의 포맷을 존중하면서 내용만 한글로 번역해 줘. 
        다른 부가적인 말은 하지 말고 원본 텍스트의 내용만 답해줘. 
        말투는 ~니다 체로 부탁해. 
        만약 전문적인 용어가 나오게 된다면 그 용어의 옆에 용어(영문 용어) 와 같이 영문 표기도 병기해 줘. 
        무조건 원본의 포맷을 가장 중요시 해줘.
        별도의 latex 블록을 만들지 말아줘.
        ${content}`,
      },
    ],
    model: "gpt-4o-2024-05-13",
    stream: false,
  });

  fs.writeFileSync(
    "./out.txt" ?? "",
    response.choices[0]?.message.content ?? "",
  );

  console.log("done");
  // console.log(response.choices[0].message.content);
  // return response.choices[0].message.content;
};

try {
  await translate(fileContent);
} catch (e) {
  console.log("ERROR: ", e);
}
