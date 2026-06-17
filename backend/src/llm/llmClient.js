/**
 * llmClient.js
 * Lightweight wrapper for OpenAI LLM calls.
 */

import OpenAI from "openai";
import logger from "../utils/logger.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function callLLM(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful customer support assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const text = response.choices[0].message.content;

    logger.info({
      event: "llm_response",
      text
    });

    return text;

  } catch (err) {
    logger.error({
      event: "llm_error",
      error: err.message
    });

    return "Sorry, something went wrong while generating a response.";
  }
}
