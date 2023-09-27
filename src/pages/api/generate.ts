import OpenAI from "openai";
import type { NextApiRequest, NextApiResponse } from "next";

const configuration = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const ask: string = req.body.ask as string || "";
  if (ask.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid ask",
      },
    });
    return;
  }
  console.log('ask', ask)
  const completion = await configuration.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: ask }],
    //max_tokens: 1000,
  });
  console.log("prompt",completion.choices[0]?.message.content);
  res.status(200).json({ result: completion.choices[0]?.message.content });
}
