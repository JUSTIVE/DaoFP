import fs from "node:fs";
import { env } from "node:process";
// import { env } from "node:process";
import OpenAI from "openai";
import { prompt } from "./prompt";

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
        content: prompt`${content}`,
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
};

try {
  await translate(fileContent);
} catch (e) {
  console.log("ERROR: ", e);
}
