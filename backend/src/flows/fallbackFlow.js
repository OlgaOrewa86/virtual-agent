// src/flows/fallbackFlow.js
import OpenAI from "openai";

import logger from "../utils/logger.js";
import { buildResponse } from "../utils/responseBuilder.js";
import { callLLM } from "../llm/llmClient.js";
import { buildFallbackPrompt } from "../llm/fallbackPrompt.js";

export default async function fallbackFlow(userMessage, faqMatches = []) {
  logger.info("Fallback triggered — sending message to LLM");

  try {
    const prompt = buildFallbackPrompt(userMessage, faqMatches);
    const llmText = await callLLM(prompt);

    return buildResponse({
      text: llmText,
      intent: "fallback",
      source: "llm",

      // ⭐ NEW: fallback card
      card: {
        type: "fallback",
        title: "Here’s what I found",
        answer: llmText
      },

      // ⭐ NEW: helpful next-step buttons
      buttons: [
        { label: "Ask another question", value: "help" },
        { label: "Talk to support", value: "talk to human" }
      ]
    });

  } catch (err) {
    logger.error("LLM fallback error:", err);

    return buildResponse({
      text: "Sorry, I’m having trouble understanding right now. Please try again.",
      intent: "fallback_error",
      source: "llm",

      card: {
        type: "error",
        title: "Something went wrong",
        message: "The assistant could not generate a response."
      },

      buttons: [
        { label: "Try again", value: userMessage },
        { label: "Talk to support", value: "talk to human" }
      ]
    });
  }
}
