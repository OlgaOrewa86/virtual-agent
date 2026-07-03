/**
 * llmClient.js
 * Lightweight wrapper for OpenAI LLM calls.
 */

import OpenAI from "openai";
import logger from "../utils/logger.js";

const IS_CI = process.env.CI === "true";
let client = null;

function getClient() {
  if (IS_CI) {
    throw new Error("LLM client disabled in CI mode");
  }

  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  return client;
}

export async function callLLM(prompt) {
  try {
    const client = getClient();

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
