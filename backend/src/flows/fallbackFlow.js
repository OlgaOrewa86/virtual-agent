import logger from "../utils/logger.js";
import { buildResponse } from "../utils/responseBuilder.js";
import { callLLM } from "../llm/llmClient.js";
import { buildFallbackPrompt } from "../llm/fallbackPrompt.js";

export default async function fallbackFlow(userMessage, confidence = 0, faqMatches = []) {
  const text = userMessage.toLowerCase().trim();

  // --- 1. Handle very short or unclear messages ---
  if (text.length < 3) {
    return buildResponse({
      text: "Could you tell me a bit more so I can help?",
      intent: "fallback_short",
      source: "rule"
    });
  }

  // --- 2. Handle vague questions ---
  if (["what", "why", "how", "help"].includes(text)) {
    return buildResponse({
      text: "Sure — what would you like help with?",
      intent: "fallback_clarify",
      source: "rule"
    });
  }

  // --- 3. Confidence-based fallback ---
  if (confidence === 1) {
    return buildResponse({
      text: "Just to make sure I’m helping with the right thing — is this about an order, a refund, or something else?",
      intent: "fallback_clarify",
      source: "rule"
    });
  }

  // --- 4. Confidence 0 or 2–5 → LLM fallback ---
  try {
    const prompt = buildFallbackPrompt(userMessage, faqMatches);
    const llmText = await callLLM(prompt);

    return buildResponse({
      text: llmText,
      intent: "fallback_llm",
      source: "llm",
      card: {
        type: "fallback",
        title: "Here’s what I found",
        answer: llmText
      },
      buttons: [
        { label: "Ask another question", value: "help" },
        { label: "Talk to support", value: "talk to human" }
      ]
    });

  } catch (err) {
    logger.error("LLM fallback error:", err);

    return buildResponse({
      text: "Sorry, I’m having trouble understanding right now.",
      intent: "fallback_error",
      source: "rule",
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
