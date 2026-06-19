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

  // --- 1. Strong signal: order number ---
  const orderNumberRegex = /\b\d{5,10}\b/;
  if (orderNumberRegex.test(text)) {
    scores.order_status = 5;
  }

  // --- 2. Keyword scoring (whole‑word only) ---
  for (const intent in patterns) {
    const { keywords } = patterns[intent];

    for (const word of keywords) {
      const wholeWord = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");

      // Exact match → very strong
      if (text === word) {
        scores[intent] = Math.max(scores[intent], 4);
      }

      // Whole‑word match → medium
      if (wholeWord.test(text)) {
        scores[intent] = Math.max(scores[intent], 3);
      }
    }
  }

  // --- 3. Regex scoring (strongest) ---
  for (const intent in patterns) {
    const { regex } = patterns[intent];

    for (const pattern of regex) {
      if (pattern.test(text)) {
        scores[intent] = Math.max(scores[intent], 5);
      }
    }
  }

  // --- 4. Pick highest scoring intent ---
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [bestIntent, bestScore] = sorted[0];

  // --- 5. Confidence mapping ---
  // 0 → nonsense / unknown
  // 1 → vague
  // 2–3 → fallback LLM
  // 4–5 → strong intent
  if (bestScore === 0) {
    return { intent: "fallback", confidence: 0 };
  }

  if (bestScore === 1) {
    return { intent: "fallback", confidence: 1 };
  }

  return { intent: bestIntent, confidence: bestScore };
}

// Utility: escape regex special chars
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
