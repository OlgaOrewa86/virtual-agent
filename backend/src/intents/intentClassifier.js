// src/intents/intentClassifier.js
import patterns from "./patterns.js";
import { embed } from "./embedder.js";
import { loadIntentVectors } from "./model.js";
import { cosine } from "./similarity.js";
import { logNLU } from "./nluLogger.js";

export default async function classifyIntent(message) {
  if (!message || typeof message !== "string") {
    return { intent: "fallback", confidence: 0 };
  }

  const text = message.toLowerCase().trim();

  // -------------------------------
  // 1. RULE‑BASED SCORING
  // -------------------------------
  const scores = {};
  for (const intent in patterns) scores[intent] = 0;

  // Strong signal: order number
  const orderNumberRegex = /\b\d{5,10}\b/;
  const hasOrderNumber = orderNumberRegex.test(text);

  if (hasOrderNumber) {
    // ⭐ Force order_status to win immediately
    logNLU({
      message,
      ruleIntent: "order_status",
      ruleScore: 5,
      semanticIntent: null,
      semanticScore: 0,
      finalIntent: "order_status",
      finalConfidence: 5
    });

    return { intent: "order_status", confidence: 5 };
  }

  // Keyword scoring
  for (const intent in patterns) {
    const { keywords } = patterns[intent];

    for (const word of keywords) {
      const wholeWord = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");

      // Exact match
      if (text === word) {
        if (intent === "support_request") {
          scores.support_request = Math.max(scores.support_request, 1);
        } else {
          scores[intent] = Math.max(scores[intent], 4);
        }
      }

      // Whole word match
      if (wholeWord.test(text)) {
        if (intent === "support_request") {
          // ⭐ Prevent support_request from overpowering other intents
          scores.support_request = Math.max(scores.support_request, 1);
        } else {
          scores[intent] = Math.max(scores[intent], 3);
        }
      }
    }
  }

  // Regex scoring
  for (const intent in patterns) {
    const { regex } = patterns[intent];

    for (const pattern of regex) {
      if (pattern.test(text)) {
        if (intent === "support_request") {
          // ⭐ Support request regex should NOT override everything
          scores.support_request = Math.max(scores.support_request, 2);
        } else {
          scores[intent] = Math.max(scores[intent], 5);
        }
      }
    }
  }

  // Best rule‑based intent
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [ruleIntent, ruleScore] = sorted[0];

  // If rule‑based score is strong, return immediately
  if (ruleScore >= 4) {
    logNLU({
      message,
      ruleIntent,
      ruleScore,
      semanticIntent: null,
      semanticScore: 0,
      finalIntent: ruleIntent,
      finalConfidence: ruleScore
    });
    return { intent: ruleIntent, confidence: ruleScore };
  }

  // -----------------------------------
  // 2. SEMANTIC NLU (embedding similarity)
  // -----------------------------------
  const userVec = await embed(text);
  const intentVectors = await loadIntentVectors();

  let bestIntent = "fallback";
  let bestSim = -1;

  for (const intent in intentVectors) {
    const sim = cosine(userVec, intentVectors[intent]);
    if (sim > bestSim) {
      bestSim = sim;
      bestIntent = intent;
    }
  }

  // Map similarity → your 0–5 confidence scale
  let nluConfidence = 0;
  if (bestSim > 0.80) nluConfidence = 5;
  else if (bestSim > 0.65) nluConfidence = 4;
  else if (bestSim > 0.50) nluConfidence = 3;
  else if (bestSim > 0.35) nluConfidence = 2;
  else if (bestSim > 0.20) nluConfidence = 1;

  // -----------------------------------
  // 3. HYBRID DECISION LOGIC
  // -----------------------------------
  let finalIntent;
  let finalConfidence;

  if (ruleScore > 0) {
    if (nluConfidence > ruleScore) {
      finalIntent = bestIntent;
      finalConfidence = nluConfidence;
    } else {
      finalIntent = ruleIntent;
      finalConfidence = ruleScore;
    }
  } else {
    if (nluConfidence === 0) {
      finalIntent = "fallback";
      finalConfidence = 0;
    } else {
      finalIntent = bestIntent;
      finalConfidence = nluConfidence;
    }
  }

  // NLU LOGGING
  logNLU({
    message,
    ruleIntent,
    ruleScore,
    semanticIntent: bestIntent,
    semanticScore: bestSim,
    finalIntent,
    finalConfidence
  });

  return { intent: finalIntent, confidence: finalConfidence };
}

// Utility: escape regex special chars
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
