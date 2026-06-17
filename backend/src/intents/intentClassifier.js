// src/intents/intentClassifier.js
import patterns from "./patterns.js";

export default async function classifyIntent(message) {
  if (!message || typeof message !== "string") {
    return "fallback";
  }

  const text = message.toLowerCase().trim();

  // --- 1. Detect standalone order numbers (5–10 digits) ---
  if (/^\d{5,10}$/.test(text)) {
    return "order_status";
  }

  // --- 2. Detect order numbers inside a sentence ---
  if (/\b\d{5,10}\b/.test(text)) {
    return "order_status";
  }

  // --- 3. Keyword-based intent detection ---
  for (const intent in patterns) {
    const keywords = patterns[intent];

    if (keywords.some((word) => text.includes(word))) {
      return intent;
    }
  }

  // --- 4. Nothing matched → fallback ---
  return "fallback";
}
