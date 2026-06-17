import patterns from "./patterns.js";

export default async function classifyIntent(message) {
  if (!message || typeof message !== "string") {
    return { intent: "fallback", confidence: 0 };
  }

  const text = message.toLowerCase().trim();
  const scores = {};

  // Initialize scores
  for (const intent in patterns) {
    scores[intent] = 0;
  }

  // Strong signal: order number
  const orderRegex = /\b\d{5,10}\b/;
  if (orderRegex.test(text)) {
    scores.order_status += 3;
  }

  // Keyword scoring
  for (const intent in patterns) {
    const { keywords } = patterns[intent];
    for (const word of keywords) {
      if (text.includes(word)) {
        scores[intent] += 1;
      }
    }
  }

  // Regex scoring
  for (const intent in patterns) {
    const { regex } = patterns[intent];
    for (const pattern of regex) {
      if (pattern.test(text)) {
        scores[intent] += 2;
      }
    }
  }

  // Pick highest scoring intent
  const [bestIntent, bestScore] = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])[0];

  if (bestScore > 0) {
    return { intent: bestIntent, confidence: bestScore };
  }

  return { intent: "fallback", confidence: 0 };
}
