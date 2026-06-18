// src/intents/intentClassifier.js
import patterns from "./patterns.js";

export default async function classifyIntent(message) {
  if (!message || typeof message !== "string") {
    return { intent: "fallback", confidence: 0 };
  }

  const text = message.toLowerCase().trim();
  const scores = {};

  // Initialise scores
  for (const intent in patterns) {
    scores[intent] = 0;
  }

  // --- Strong signal: order number ---
  const orderNumberRegex = /\b\d{5,10}\b/;
  if (orderNumberRegex.test(text)) {
    scores.order_status = Math.max(scores.order_status, 5);
  }

  // --- Keyword scoring ---
  for (const intent in patterns) {
    const { keywords } = patterns[intent];

    for (const word of keywords) {
      const exactMatch = text === word;
      const partialMatch = text.includes(word);

      // Exact match → very strong signal
      if (exactMatch) {
        scores[intent] = Math.max(scores[intent], 4);
      }

      // Partial match → medium signal
      if (partialMatch) {
        scores[intent] = Math.max(scores[intent], 3);
      }
    }
  }

  // --- Regex scoring (strongest signal) ---
  for (const intent in patterns) {
    const { regex } = patterns[intent];

    for (const pattern of regex) {
      if (pattern.test(text)) {
        scores[intent] = Math.max(scores[intent], 5);
      }
    }
  }

  // --- Pick highest scoring intent ---
  const [bestIntent, bestScore] = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0];

  // If we have a meaningful score → return it
  if (bestScore > 0) {
    return { intent: bestIntent, confidence: bestScore };
  }

  // Otherwise → fallback
  return { intent: "fallback", confidence: 0 };
}
