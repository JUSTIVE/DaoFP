import { env } from "node:process";
import OpenAI from "openai";
import { prompt } from "./prompt";

export const translate = async (content: string): Promise<string> => {
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
  return response.choices[0]?.message.content ?? "";
};
